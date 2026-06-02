const db = require('../config/database');
const { getSimpleReply } = require('../utils/chatbotReplies');

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId, guestId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ status: 'error', message: 'Message is required' });
    }

    const parsedSessionId = sessionId ? parseInt(sessionId, 10) : null;
    const validSessionId = parsedSessionId && !Number.isNaN(parsedSessionId) ? parsedSessionId : null;

    if (!validSessionId && !guestId && !req.user) {
      return res.status(400).json({
        status: 'error',
        message: 'Please refresh the page and try again (missing guest session).'
      });
    }

    let session;

    if (validSessionId) {
      session = await db('chat_sessions').where({ id: validSessionId }).first();
      if (!session) {
        return res.status(404).json({ status: 'error', message: 'Session not found' });
      }
      if (req.user && session.user_id && session.user_id !== req.user.id) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
      }
      if (!req.user && session.guest_id && session.guest_id !== guestId) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
      }
    } else {
      await db('chat_sessions').insert({
        user_id: req.user ? req.user.id : null,
        guest_id: req.user ? null : guestId
      });
      session = await db('chat_sessions').orderBy('id', 'desc').first();
    }

    const userText = message.trim();

    await db('chat_messages').insert({
      session_id: session.id,
      role: 'user',
      content: userText
    });

    const assistantContent = getSimpleReply(userText);

    await db('chat_messages').insert({
      session_id: session.id,
      role: 'assistant',
      content: assistantContent
    });

    await db('chat_sessions').where({ id: session.id }).update({ updated_at: db.fn.now() });

    res.json({
      status: 'success',
      data: {
        sessionId: session.id,
        reply: assistantContent
      }
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process chat message',
      error: error.message
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await db('chat_sessions')
      .select(
        'chat_sessions.*',
        'users.email as user_email',
        db.raw("CONCAT(users.first_name, ' ', users.last_name) as user_name")
      )
      .leftJoin('users', 'chat_sessions.user_id', 'users.id')
      .orderBy('chat_sessions.updated_at', 'desc');

    const enriched = await Promise.all(
      sessions.map(async (session) => {
        const msgCount = await db('chat_messages')
          .where({ session_id: session.id })
          .count('id as count')
          .first();
        const last = await db('chat_messages')
          .where({ session_id: session.id })
          .orderBy('created_at', 'desc')
          .first();
        return {
          id: session.id,
          userId: session.user_id,
          guestId: session.guest_id,
          userEmail: session.user_email,
          userName: session.user_name,
          displayName: session.user_name || (session.guest_id ? `Guest ${session.guest_id.slice(0, 8)}` : 'Anonymous'),
          messageCount: parseInt(msgCount?.count || 0, 10),
          lastMessage: last?.content?.slice(0, 120) || '',
          updatedAt: session.updated_at,
          createdAt: session.created_at
        };
      })
    );

    res.json({ status: 'success', data: { sessions: enriched } });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch chat sessions' });
  }
};

const getSessionMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await db('chat_sessions').where({ id }).first();
    if (!session) {
      return res.status(404).json({ status: 'error', message: 'Session not found' });
    }

    const messages = await db('chat_messages')
      .where({ session_id: id })
      .orderBy('created_at', 'asc');

    res.json({
      status: 'success',
      data: {
        session: {
          id: session.id,
          userId: session.user_id,
          guestId: session.guest_id
        },
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Get session messages error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch messages' });
  }
};

module.exports = {
  sendMessage,
  getSessions,
  getSessionMessages
};
