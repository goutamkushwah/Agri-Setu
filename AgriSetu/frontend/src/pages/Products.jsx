import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const MOCK_PRODUCTS = [
  { 
    id: '1', 
    name: 'Fresh Tomatoes', 
    price: 40, 
    image: 'data:image/webp;base64,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', 
    unit: 'kg', 
    category: 'vegetables',
    description: 'Fresh, juicy tomatoes from local farms',
    farmer: 'Green Valley Farm',
    rating: 4.5,
    reviews: 23,
    organic: true,
    stock: 50
  },
  { 
    id: '2', 
    name: 'Organic Carrots', 
    price: 60, 
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 
    unit: 'kg', 
    category: 'vegetables',
    description: 'Sweet, crunchy organic carrots',
    farmer: 'Sunrise Organic',
    rating: 4.8,
    reviews: 15,
    organic: true,
    stock: 30
  },
  { 
    id: '3', 
    name: 'Green Spinach', 
    price: 30, 
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 
    unit: 'bunch', 
    category: 'vegetables',
    description: 'Fresh leafy green spinach',
    farmer: 'Leafy Greens Co.',
    rating: 4.2,
    reviews: 18,
    organic: false,
    stock: 25
  },
  { 
    id: '4', 
    name: 'Fresh Potatoes', 
    price: 25, 
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 
    unit: 'kg', 
    category: 'vegetables',
    description: 'Farm-fresh potatoes, perfect for cooking',
    farmer: 'Mountain Farm',
    rating: 4.3,
    reviews: 31,
    organic: false,
    stock: 100
  },
  { 
    id: '5', 
    name: 'Bell Peppers', 
    price: 80, 
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', 
    unit: 'kg', 
    category: 'vegetables',
    description: 'Colorful bell peppers in red, yellow, and green',
    farmer: 'Colorful Harvest',
    rating: 4.6,
    reviews: 12,
    organic: true,
    stock: 20
  },
  { 
    id: '6', 
    name: 'Fresh Broccoli', 
    price: 70, 
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', 
    unit: 'kg', 
    category: 'vegetables',
    description: 'Nutritious fresh broccoli heads',
    farmer: 'Healthy Greens',
    rating: 4.4,
    reviews: 19,
    organic: false,
    stock: 15
  },
  { 
    id: '7', 
    name: 'Organic Lettuce', 
    price: 45, 
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', 
    unit: 'head', 
    category: 'vegetables',
    description: 'Crisp organic lettuce for salads',
    farmer: 'Garden Fresh',
    rating: 4.7,
    reviews: 8,
    organic: true,
    stock: 40
  },
  { 
    id: '8', 
    name: 'Fresh Cauliflower', 
    price: 50, 
    image: 'https://images.unsplash.com/photo-1568584711271-78d77c3f3a56?w=400data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAEBQMGBwIBAAj/xABBEAACAQMDAgQDBgQEAwgDAAABAgMABBEFEiExQQYTUWEUInEjMoGRobEHQsHRFVJi8DNy4RYkU2OCkrLxNISi/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDBAAFBv/EACYRAAICAgEEAgIDAQAAAAAAAAABAhEDIRITIjFBBFEyYSNxgRT/2gAMAwEAAhEDEQA/AELCcqH2/KPwzUkFwp/4kZpw5jI8sgBR2oJo4lJwuPfFeTZ5vAGFwEkUFOGPYUVfW8U0QKYU10fK8n/UB1IqK0DSPg5NNGXorWqBY7ORZM7jto84VdqkE0wYxxwYIGe9All3ZCfjii5NFlFJbPreNcHcuKnWBeOh9q8hmU8YH41Y9E8JahfsJ5SLe2cZBI+Zh9K6nPSO4K9A+gaZdajO0UCjanLO33RRuoeENWBLW6Qy/wDK+P3q92Frb6Zax2tvnavr1J9TRDSpG23jmtHRXGmV4JqjO4vBermAmRreM46FzkflVb1nRb/TJCl1E23rvUZU/jWu3l9HGGTOH6gDrUcohurN1nw0ci4ZOx+tI8UJrjHyLLGqMZhhHBJopcJwDRnivSm0q9+xz8NKcxE9vYmlBfjJzWVXB1Izt1ondFbPApdcQNK21V4onzwFxXUd2ijjGfWnTTOpS8gdhp8ZkPmjio7u1UTbYUO2mQYTAeX171wZVgJLfeo0B440D2+jyR7JZ87SelMHS2YBEjwfpUK6q1ztRjwtS221rjzDwB2rlRRRjVIkW3SFT5ijkcVGqCVWCURft5m0L0qCNhAPlHWll2hVRQF8FuYgJuIGee1G6bHGqHzeMdjRMU6opbHJpfeF8l4/lz6VOGR3pjwyxS2S31qjRsPWq7Pp8wkOyR9vtTq1W4u1ZSwGO5qCVbiNyo5x71pg5fZTlFlhW30wKXeVyMcfNUDHSYGBbcc/6jVRk/xIwEKlxIynDlEJUH60qnfU0OZYZQo7kGr8Y/RqXx8ZoqSaXKCdnHuxr5JdOQ/ZxgZ9azdLu/I2Kr4PrxUqz6lHtzJ9Oc0rSspHBBF9vIrRk+yJWRu+6llpdm2vFgmVZ97bV9aqvxGrSlsSEAd6l0ma4tdSimvSZY8EHH8ue/4UHVBnBcfBsPgiy03UrmWeS1Q+SAwDDjd9PwrQZCscf3lHHFZT4P1+HTr+YXGww3CD7UHpirPrXiKL4cC1cvuHLA5CUOvGK8GDnCW/BYGlXYzAkns2eKCS5W4mZ92DEcMvcUjsNSN3ZJufLICrfWg7yW4t7g3UMm0Ywx9RQWa2mB5Btq19svInVshgVxiphrkdpHG0ibogAuMc7qqS6hc3t9GsjD7IYHHc9651O4MwESHMKZGfU+tRnlabcSbyfRf3u9L1mxKOscySDBVh0P8ASqVqvhmztZiS8ixHlSW7f3ojQIzB9o7kP1VfT3Nd/wAQLny/DEksTjzPl8sDkhiR/TNXbjNdyLYoqVWIm0GykHE7fnUZ8Mx44uiPTpSG0i8WzQi4g067khYZVgnBHrV/8BeHLu6thqHiBZkk3kR278cD+Yj+lBQXpGmWHClYgXw7PGPsrhPegLrw1fTHKzRn8a2S4sLSZQjWsZUdMLjH5Uvl8O2TZ8qOZGPcSdPzqnSRHhjfkyKDwtqMUm5Sr464NGGw1CI//jN+HNWfXDqXh1d00fmWpP8Ax0GQPqO1KY/FcTuEAUcct61FwUXsrH4kWrixVtuYZA89vLsH+mvpJVnkJRGUehUirDBr9u/zOqMD0FDT38WpXAUFYbVThtoALUvTVAfwm/YoG1zt3AY6jNQzyYVgOVFWC307Q57pmeIGMLjG7qaKTSdH8t2YLDCO+7k0OivRCfwZFMs/PjfegO0+ldyPOWJ8tv8A21Z/J0yIn4S5L+ihc1yWVuVCAf6hzT8JIn/zNeSbwtfWlpp0EM43KOWcdM+9OkudPu2YsqhF6FgOap1np0TurRSyIpUEqOhpidOwoKXDLjtQ5yPa4xG0kekSRPJIkQUdmX+lDNoWhzQCYxQ4PT5qWy20wkyXDH3GM0FJaXzBhGB19a7qMHFDOfQNIQHbEEDejnmhZfDelYJw6HHGH71zZ+F/EWox+cigqoyBK+B+FXzSvCtja6fHJqcbX1wqgsHO4BscgCrRtrwRyTjHw7Bm8J6Ynh+ytWLbon80OvVs9QfaqvqGkT2jOLQRtGTyjLgmnt9rapeNAcpEOEjdduwelSxTQzpljv8AQ1lz25HnSipO6KrplzJZzYlVgjtg5HQ04un8y2lRgMbcjHeibqC2JLjZno2R1qCOOKKXJDNGegPNIrrQVCtFbVm3t5BLFl28deKaQWLW8Kmf7zchTTSztbS2Z3VeCeAF59qC1bUIoPMnnbAUcZ/ag3w37D0lf6HOg2vxl15ByEVcuVP6VbrfTbOBPKjtk29fmG796on8KtROp3GrXLqQPMQRjJ+7g1obybVy3FbPjpKNsdrej59qDAOMcDHauY+dxZh/vvS66usM5PYZxzml9hqvxFwqAbHYlQOzVaWVIXw6Y9mugmQBx60PAs8zbhlUz/N3qeKJA2Cd7Dt2qSZtsbbB+vSmXcg2KtTQlTHMvmxPkNxkY9CKqGpfw3sSm+1nlWYkny36H2GOlW65lbeCqBlBx9K4W+ZwrbsfNig4p+QwySh+Jlc/hyW0naMOY3wAVZulTppE0S7VnjI6DNMP4laounXFmP55g2WHfBH96qTeLF3qDG3HUDnNTcY+DXDLJqywQ6fdI65niAHTAqWTTlunPxt4zheiJ8oqqN4sPmO8cD7emDnI+lDza3dSbcJKQ/cCuUYr0Fyk/Zolq9nYgBDnA74qGfWLRpSTGhP1rPZLy/mKlVYHp14+tDvaajuO5sn1DHmni/pE5f2XrQpXW1jAUMduD83cUxiuJTJgxj86rFjdwW99PBI7xASEgf6TWo+HfDkZto7i6Zir4dIw3btmsXGTfaacuRY1ZX4bC71KdY7aDJPUnoPqatGi+GfJHmamFkcHKxqeB9fWn1rDb2qFLeJI1JyQq45qV34OOta4Yorb8mOeeUvB6AqgIAPYCopXjjGBjJr3nZvOQ1DTqXcMCoOOPSqt0iFEqQxkLK6R7+zbecUp1iyiuIWEMSRzY+WRBg5/tRsUjiLbvBYnt3qG4Z0XzenzcCpS4vTDVGVvrog1SWK/RortMRyL1z6Y9qcx3quu9TuVh1zVp1DQNH1cvPeWMTzsu3zsFWX0xisi1+01DQb2e0jjmaNn+zdcnePb3rI8bi9BulstzaxBHIE8wNI33IkG5mPsKr1jZ3ni7xCNLVJbXarSSSzLyijj7vTOSKReFLqZNaF3IrSMBgEEblB9M1q/gieL/FbwvC6OsQCSv/Nk5I+vFU4R8sksvJ0XTTrG30ywhs7WNVihQIABjp3qNpUbe/mbjHwB6Ggtfunj06RopPvEJlTzz1/T96runXCxbzMz4kUjg9T2pMuZKXFFOSjKmO9Tme1sHnZ9xft9arcMqyq23gijNdncW1uhPmRnOHI9KTQTojjOfm61iy5nzpEsz7gkX13B/wAKeRTns3H5VYdP8QxTQrGwCSj72SADVWvCIpMHoOR70tuLpYAZJm2IKqs2SDIxm4s0R5Qctn3FeRgPBsTuP1qsaRqatawAkvK5JCk9B2qx2VvdyoziBlPbHFb8c3JWa7RQfHkhkvYdPdRIYl3DjJJNVWWJl+UAxeoK4re7LSLOCb42W3Q3rLhpWGWA9BXt9Z2d4Ct3ZxTKpyvmRgnP5VXiVjkpUfnto1BCqWcn8KKjYgY2H061rfiTwRpF7bF7K3SzvQPs3ThWPow7iqLfeBvEcUfnJbJIEPIjlGfwFCmh+cWV+Y7EUN1qGSba2NxqG/Fwk3lSqySKcFWGCDQ8jsG55ops50XFLFbjxbYqVwty4jdiK2lCVHloPu4A46Vnmj6PNqeq28ofy4rWVZmfHocgCtDaQQggZYnvU8X42H5DTlR2TsX1PpUIcsrSOuDg8VH55jieRlIzyqnqaFvJDs3yFvu847UZOiEY2Es7MgaQ9RyPSgpN0jfI2APWomlSO2Xe8meowaBkeRcSRq7ljxhsk/hU3MbihhId0iJFJtIOT3NQ373EcYyd6hgM+1E2cgTkqA5HJI5Nc3NyQDkAnpii2mjqaBxM7I7R9FBqGfQLnU4Q8yxoVBMXmjJDY6n0ryxSbUdTt2iQ/BxPmVuxI9PXmrQZlDYxkYp8cL8iT7tGVeDP4WXNvMZtfmRQnCxwPnd757VoDeH9KtowUSSM8crK2f1o1LsCYo2AMZ96glmadpMkKqDIpmo0IopFd126Xd8FEPkU7ixOTmlcowVBHG3Nd3pG95SSxcnk+tQzvmzhk778VheLlKzLkyNsNmnjudGaHdteE7kT/MarDTqSQGGR2B5olpuo4Bwee/SqxE9hqUe/4x4nRj5vIB49u1Ty4O7kFS6i/ZaZJFuIVkYHfGMYz1qj+KNVLahBaqwzklgfXr/v6V7J4jXTy8QufNRTwSOTXHhfTNI8T3GpXepyXEDhvsXDhV6dQfXPb3q+HFpuRyj3WzXfAujRw6bbXd2ga7ePcWP8tW+CbzDI0bbgh247Z71VNKujFpNumnyJLM22BN3JDep/KrZaWws7YJuLkcsx7k9avidukatPaOLqUqoG07mNDXLNG8ciybm7riiJphJ94hUHVu9BWYQ3Ics52E7AT1+tUlY6DX86SMEKpOSTu7V7FH5kbGT5T0IU1zd3aRgorc9velL6g6b33AdsU8aEdmffxW0cQXMOpW6fPMxWZ88ZA4OPU1QkYkcnJ+lbTrmnz6lZCDbDJFN80seTvx2wex96x28t2tbqW3nUJJGxUqx5FHTGjJ1Ru3huELobqGwZmbDd17UKdQlsZ1jlZpYw3c45pZpupT2ETRPGZIWIOM8r/em9xqGnSQedGISQdxRxjFefKetFZpcmD+JNVJit76ycEw8sjcZFR22rG901LmSNoVblFP3jVe1LxDY3LGJpFQjjGMDPtxQI1BAu1rkbQBsPUKf7VnnnkiaT9DBNT1eN33sgtWY+X8uWHtn0oWPWL2xnW5kkknSPPyscEZ78CoE1dLdngvN4iY5xjJU+o9aXat4js7aAfBSC4eT+YDlR7571qx8Z47vZjyzyRlVl1i8QGewmni2pKib2R2zke3FL49UuLyIHzX8x+EiQcsT05qh6J4glGt2sRUmK5kWBk9mOM/hn8q1PQbC1ttZivJflYIYwOwJ74qXCbey0cr9ss2hxy2ujWsNwgSaOIeaoOQG7896lbczFFmUcc8c0RcmNkEW7BbgYpVOrWbkxSmTfxgjp+NaW2jRFWdmMeeFTG/qXc5o5E2QnYEJPLNVZsdQMt0SzdOCGGKe3OoRLiJcHtjpRjkTs6ca0UnxEWtrqWEkZBzkcDmgopC+jvv6pIMUx8bXKPFDLxu3EcelKbdG/wHazD7ViF+hrlT2eXli4zaB4xmcnJ4xnB61mvizT57XU7rdlCZA2AfvI3StQ0e3V7plEm5MgBiMZ9an8X+GIdd0txDiK8VPsZMZzjnafrTxlch8EX5MLW/2p5bwJIBxkk1p/gi8sdQ8LLYTW/lDcxLIRnd2I4rKmgkSRonXbKGKsp7EdasnhRJLK7WXc5XaQyA/76UfkJdPRrjFS0bj4SsYNOu7WXzmuHmjIkYdEbAwcfnVwmuQVIVhjOOKyTTteksvJulZygb7QdMr0/tVy/wAckvYlSCDYkpLBgeOlZcOWkGHFPiMrq+VBJ9iG2jGScjNRQTXEkSNAFDZ4A/Wll1csoRZAsEYyWYmo7vxHBF5SWR8126kcbapLKl5Gk1EtQtZvKaQum5l7gkCkElrIZ/kUsQcls8GgBqV9dY3TsWB+YKe3oKcxtOIOgAc4A71TFJTWhOVnNzd/DQqpVV/1A8sR2NVTU/BkWt3j6ib0xNNyyGINg+3Snt1DG0plkk3xdMf5amhll8tfLZAg4FWOBLy2VJHihZnVcqGcdSKJtUsL6JbDVIFIYbY36E+xIqWPY86t6tQMxCBWAXcMgM3QEd681Qp2R6ruyn634OmsbhhpcJnwxJWQ5IH16UjufNsV/wC+x/DluAW4B/StY8OxSXs0nnI8gUYBP3ce9OE8P28l0txd7XCfdjKgg/XNOsHU2aozVWUHSvCWr6xZB7y3iWFlBiaU7Xb8P70Pa/wqub24LXrraRhvmdTlmHt2/OthAGBzgDtXxKbcnpWiPx4REn3+TM7P+Etnp2oW93barPI8b7sTRqRjB6Yx60ZqgntY3VkYuh5x9eoq4ajc7EOwnGM8dqrOtzOfMMSPLIDkZHb0pciS2hJQ1oK0DVBcxLHK4BX5mDDnFdanqMcMbs5DH1A5xVPvfiIHhuFDpkFSF4yCOhz71FLqEcoKPI+CMAnotZ+r6ZbG7Wizpq9sZIFSNcgZD98g4pDrF7cHUWlMxVT83Xp7UhjvH+HEkZy0UufwJw396Ya226BjGwEu0ken0NIk26Em20TTzJfeRDNIPsjmQ57VDe3TXUq2loOBwoH7n2pDaNLK8krscuflAGATVs0ey8iETXC4kPVj6U8JJKiDi5uwrT7X4SIDHP8AMx6mg9V8SJZ+Yluvny7GwgbGTj+vSmthZvrEjRRS7IUOHdev/KD2+tWHS/CWkWkDgWiFn+88nzMfzq0Iyk7KKDitH5w8O6FqniHUJvgrKa5k3nzGC4VWJydxPA5rSNH/AIXeIYbj7a4srSLOS24yMR6AADn6mtesNPtNMtzb2NvHBGTkhABuNT8B9mcnqa0SSl5KLRRLf+HNgsciXF7czt2wQir+lLdSs38N2y2ERmlTefKk2lsZ5xkfvWjKXeRkPAHQV6yLCrNwXxwT2qMvjxfgDS/0wvU73U2dTMJFhBJ+0RthzjvUdpqCW8oFw6CWZtsRA+Uf9a266FrJCIpUjnWQ/MrjINVbxDoOkLDLd29nHHNCrNhACp/D1pXgTRDpSu2wbQbUQx+dLIEjI+Vn/mNN7ueNVDI2QBncDWb6V4yt2uhCHl+G24jLpjaffPajtR8TQhcSTAoq8lOQT6U+NqC4lrTQ8ur3d94gISNoU8tXIvQmVVosA/zHmhvDb2+pLBKUkR2XO1xzg9CKaf8AZvT2ZmnMzuSSSGI/amk5v8Qv9BVjJmWNcfzD09a7isFvdYW1eQKoLMR365oW0uNk0Wfm+YcYznn9KeaVpsraxLfs5SIEqpI5fPX8Kz43ZnhGywWdvBaQiO3QIuc4FduQnzE/QVxvWMhRk5717KY4j83LGtt2tGlJI42v5XXOa+CsiYwWJ/SoXdmYBCrZONua4ur0RJ5ZU5x2pPL2McXyRLC5KsxZSSw7ClixReXuSUtHLxz1o6e7RIdy4yeCBSq/u9tuWRRlf3rnFNCN1sSaxLtvHHzFMbQD6VWZrHUbm9InuoLe1Q/LJjkj6etW+GCCe4S4mLSnlsHoKg1KKNFd/JS4uNpIB4X2UfpUHBGTm77SkQ2c0WqXsaTI9hcE+UCfmQ7fX60bdhmsER1YzYAY5AAPFVS0bUL/AFddPs0kurickJFGBgdz1Pb1q6Q/w58UPZmaSWxjl/lgeUkn6kDANCUZSNiqtnukW9lDHHLcyJvX7oLfdNJvFXjmKBmtLFdzqPmYHhf+tKfEOna/YrJY3Ft5ErcKxk4Prhu9ViPRLpZo1dMliOQepJ9aOLFGMe4ClG6R+jP4ZwxnwfYXHmbzKpkY+5OSKs73KoMLSLwRpNxo/huxsJtokjXJ2dieadPbgbg7khuvantpaK0r2dIWdTJuwCBg17HGyEuTndUKOXO1N2FAOfWilkBUbSKMO57BLQLtuDIXG1ee57UJezn51DrjH+brUk9zCspXOBjls9/pS+O3N5OW5x0yDxVK4iXZ5HLE0Bdz82epP7UBdyrJC0YQrEQQxH82aa3OkrjMcjDH3sEdarmtLNBazxwsHZVJBJxQettAbRjGo2F5pt7NAibI0fYjPj5j2P0qwaPo9xP5b6iUlAw6xgcA+9F6xYTfDwahcMg8+RY9pBOBt60/tm8qFPusGACn8Km3fhAglJWGwShZkaNl4Tacdh1Aqx2sjmFTuqtQ2TymQIxBI5x2PanOl3e+zXLYZSVZTngjrTKVDPQv0e5ifVLe3lUbXkA69Oa0dQXX5CAgOABWManfxWczXFs4BgO5X9/7ZrWPC+ppq+gWmohlIuIw/HGD3FR+M70Thq0MWYrwqc/5qS6lPJ5ohV9zHsOoFGX1ypXy0Zg79MdqQTWrJM7yzvk52nHJFXbp6NCVonF7LbTLM6KEXK7QevvUeoXUkuPkYEnqB1H0r3RLUlpHlJlO7Chh0qw7UHJ255IJApFbC3SKdctcg/dZVxgKzYNIdU1IWoVXmO8AkrnGT7etW/UPJEjEqGIHJzWX+PZbaGdJEIXLj5Sc5oTtaROW0X7R2J0wSNwWAAb9zXbWzSBmkAAP8ue1Q6fcRzaTaSwACGWMSDHvUqu1xcJHCc7jii9bMFboI0Hw/pmj6hc3unW7JLcgb2Yk/XBPQH2q2x7pVGMqCOfegbZSsPltjCjLNngV9Za1Z3UzwWkwfy0zuxgH6VVOlZsVeGTahpdrqUBgvYEkjwR84yR9D/aqrbeBtGsdWiu43lbyySIZWymex9eKtFzdOkY+z3OD9cflSqW6PmlWdXDDc2B92u7WdKKuxsl4qRtkgEetRrcLOpYuAv8AMfakt9ZLqNuViuZIH2/LzkH04pFYXl1YyPYahIN6HKlc7WHXg1nm5Rf6G5luudSSNBtfCjjHc+9Q395JEhBMagqOSf2FA6NAsqPJdMsg3ZVQMAfWir2ytpY5Gk3jdjaA3FcuT2WdUJ/j3kJSMszFTwRzTazvUt7ZISdrBfmJ65pdE9vaFpFUsuOT1x+NDtqtq86GTI3Ht/Wm515JtL0WSOUBMlfm6kseDVM12/8AN1WS1gAZWXdIw6D2qW48Sw296YUBCY5JPGelItlxc6vNKm+OGWUNg9CuMZpZZtGLLla/EcywR3ECGaIMifdVh39aHuxboE8tBlO2OnvUU2poJDaWo8yROXPZagXejlmYvu55A4NThCeR8ovRJ5qVBtvcyxoJVD7m4AIApLf6qyXchQNGHO4qfX1p3pBl+LXzHLqSMA9vWofE2lLeaiJRkDywODjua1LE2hnnbiqMb1HUNQkDQMk0aDrGyFcfWtk/glf6jceFbu2uIsWdpJiB8YLkjJX/AK1YjBp15G0rxxSgjIWQDn6k1NpSRaXazQaXHGkMrmQhOm72prjxqJ6nRcWFS38McZMrsZSuQcHANLGlu7r7SYhFyMHqfyr68vriVdkDjIH3mXP5UDfHUrmAW0EsYlIILNGeD69aSn7DxLb58VtHGiJwMAk8ceuaX6lqcUe6P4i3Py4B3YJP/wBVXZP8fEEcUyQXB43MjYI/OqrdXWqfFtLeaLctEpO1g6tnt0Uk0aaElos+papHBF58oYp0G7jdSbRvDsPinUo9R1E+ZZRMQIemT3/AdKXeINSsk0eWb7Wa9EZWGDym+yc9yCP3pz/DLX3t9HggukZdoIO9cFmz1JNdGLb5Mk5Fo1SKLTgIoEVIol+VR/Kv0qHRJ45bstDIMqm7GKP8TWzLp73cbxuzIc7DweO1VjwoxS5GejBlx+FKk2ZZRqdlhv8AWXsrKfyACdpXBNVrQ9QlgkjkhPJfYD6AijtVUMJ4/rkUBpdrtgiYnaAwJZugxTqNx2TyOXNMei71G5Hl+bIckk/SmVtA5tjGGLMePr680GtyZgLe1U+WO/dqYWbPHIkchCq3TJAyfSoRfcXin5Z4bO4gjWVWVQOMZ5qk+L7i5t9Vt5lRnjWPDyKPlB5xnvWlXADBg6KMjAP0pHfGC7RY7uFNrAoyYzkVplj5IrLYNoOrKbEKdoOfmPoammuzdbmMqAKPlUHpWU69eXnhjWIoLTfLp9wfskkk75wRk0/0fUb7U7po7i3nhG35soRGv/q6VLcIlLVbLX8RG1sVEibCMFR39qov/am3h8THTXjAjZ9gkDYEdA+MNTubKIW9nM7Tv8qxRjOB3PFT+D/Ba/ZXV20jXDkHJH3aKja5SQH3qh9eW9m06NBD8QE+cyNIQM/1pH4i1i9s+PhwvmDcpA+Ve2BWmzaTa2NmWypkbAUE8k+tUHxNpU8upK1sDJE2N3zcHH41n6ab2iGTFwh2o78MWjwW6TTgmSUb2J65NP5rRWh8yL7p7f5TSfSPOt1aKcYC8rk/pThL/BKLCWLDkk8EVtwpR/oh0ZTXgC0uVodWjS4+zU5CE+pojxDrNtY3qRTsA5jDc+mTQ4h+Kmd5MKsRG3YTnP8AvFdX2m6dqEwmv7aOSUKF3SdcVZOKDD4s/YivriSeFrbMsUcpCnY4YBe/fI70wjutQjsvhDKVhOMnPJUeh7ZxzU9zawAMb2C3Yf8AmW/9s1DH8DJ8luYc9MQlwR9MisCr1o+g4s7l126SUNb7WLDbv6hOwOO+PamGm6rLbQqGjFx05j/mP0pbLopcbl+IDHnPmDP/APQoNvD87ncbqePBz1QH9Kf/AERoJm8SyX2oFry3khtEB8uDO0sMfecdc+1T3HiW0iMMFmga4kbA/wBK92/D0rlNPuguJrjzwB3UE/mKWXenQrMWa5to+oIljYfrTKVMHBfRYptVURkTSbEHLMDn8Kh06W2vJhOCqRE/IrDlx6nP7VWjFA4Ai1C2LKeglyBjpxii0s/Mh3XEoeXHDRkjj8utc5tA6cWWea+s4iIA6AnpED2/oK7hFvEpmUpHtGS3QAVSU067imlkEM0oI4JZTj2znOK8mS98nE6TxoeqsC+cfT6UFJivHFl0Dx3i+aTlSeOOo9aHvza28CQHYzsflQvgfVvQVSpNSSNcNJLGB6K/7YoV7uJi0pmadj13IwOPqaPexOni+jRrW8mtVPkSOARyB0HtUdxrReVA8u+ZFLKOBj3NZ+mr3ECMsdyShHClskfjUcOriINvLOT1bIy34iu4y+g8YGjw69c3Ku890So5Y56e1dQTeegndVGTleckVmqak0wZftBB1Zdu5W/Go5tbVMpFLJbkdGUnA/Oi+dUCoF+v57W7uFtlt7aXySN7Oqttz2FFrcJb2/IVI04IxWZWt5bxktFOJpycsVGGPvmurvX7mR1V7iRtpyI3XH61zU/oP8ZpVtcDzDcL5ecZzj7qihJ9ZSZ1eKYgAnGD196zhtfuWRonkaMPkMA4ORQ/xmoyfJZiVlHQ+S37im4zAnE0mDUvjrgh5fsYTj5jy7e3sKk1TUrewtxJK43udqKCOSazSKbWBlHtyec58kgn8TipGg1aYiVbYIV/8Z1x+pocH7Dyj6RdrnUbZYkuGniYsOUDjdke1BQ+IrONfn3biNuCD1PWqx5VyzKZYLA7eA3mYH6CvvgmmfKyiP1+HiY4o8E/Z1teEWOPxFLbI8UKI25mfnPBPWk974ikmuC8gLN6xjIrpdPt44wrJO0nQPIwBz/y1GNNtD98hG9Du/pR7UBqbNCe2meEPbqqj/LE+3/4k0v2zmYLL5gGeQXJH6ipobFDLKRHNFlch1LA5/ShrmKVLZzFdXQ29T5zc/nWJKzZyoPeOFRskNsR/LuhDmh3tdpDweQCDxjT3H7Ck+byd/KhPnMeQskYbj3Jr1LWb4ZmljsQ6OULRpjkZHTIqnFxJrIm6G0090oO6GRgP/DjmXJ/9tByX12VJCXKkEDBaX+qUpfxHcaerf8AdoZACQNhK9PfmuofFd/IYj8PLH5rBBifd1/9NPwtWB5N0MnfUFXezS7P8vngZ/AgGu0d2jUMtwSevIbFFWSS6lKf8Q3fBQrvndyOF9MFec1xdtpoKpBZpIjS/KRCpOzqO2KHE6WVRdAdyWJ2iCR8d2tX/cVHHA7sN1uw+iSD966ludKedUjtyjEnZi1H9DXRktUYBnlT/wDXcfsa5oaM7J5B5KZbK+zkqaWy3rNIV3qPfzh/amU95ZiL7K5ReOhDD9xSuWaHOHmQA9wAT+W2uTYdeyJWVufKDY9UVhUnwpkGTDgD/JAmKktJLNg32nsG2fe/Tip2ht2T5I1+nlhv2NdyYO0AeGLdgx59d8aj+lfC2jifKW8Tbv8AylP71O0FqPvQ7m/0W2D+9dRCArg2smPV4wf0zXXL7Obj9A524OYUU+0MY/rX0Swj+SMn/SEH/wARRciWUSgpaKD2xbqp/HNDfEwK/wBrHgdh9mKDs64/Ry0qo2QwbHZWxj8xUFxeF+EZsnsZc/oKImvYTxDuz/zxgChHuV5IfPqrTDH6UbZ1xPoxJgbUYn0wW/TrXZDZJ2SMe/2BG38Wr2K+hCfM8cZ9QHc/nXktxat/OsxPcoTn8zXJs5uJAhzISrxp6Nxn9OKLEavj7clvQkk/kKDklLOqpAgxyDsAx7dKJjuLuGTIRAMfe7/nTbEciZrWIKM72Jzzs2A/i1cRyMFx5MJx3aVs/pXDPNcESEDI5LkZ2/QnNcx2plXe1xJk++KPgXk2f//Z', 
    unit: 'kg', 
    category: 'vegetables',
    description: 'Fresh white cauliflower heads',
    farmer: 'White Harvest',
    rating: 4.1,
    reviews: 14,
    organic: false,
    stock: 35
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'grains', label: 'Grains' },
  { value: 'dairy', label: 'Dairy' }
];

const mapApiProduct = (p) => {
  let image = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400';
  if (p.images) {
    try {
      const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      if (Array.isArray(imgs) && imgs[0]) image = imgs[0];
    } catch {
      /* keep default */
    }
  }
  return {
    id: p.id,
    name: p.name,
    price: parseFloat(p.price),
    image,
    unit: p.unit,
    category: p.category,
    description: p.description,
    farmer: p.farmer_name || p.farm_name || 'Local Farmer',
    farmer_id: p.farmer_id,
    rating: parseFloat(p.rating) || 4,
    reviews: p.total_reviews || 0,
    organic: p.is_organic,
    stock: p.stock_quantity
  };
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/products?limit=50');
        const apiProducts = data?.data?.products || data?.data || [];
        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          setProducts(apiProducts.map(mapApiProduct));
        }
      } catch {
        /* use mock fallback */
      }
    };
    load();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getCategoryColor = (category) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      herbs: 'bg-purple-100 text-purple-800',
      grains: 'bg-yellow-100 text-yellow-800',
      dairy: 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fresh Products</h1>
          <p className="text-muted-foreground">Discover fresh, organic products from local farmers</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                className="h-10 px-3 py-2 border border-input bg-background rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop';
                    }}
                  />
                  {product.organic && (
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                      Organic
                    </Badge>
                  )}
                  <Badge className="absolute top-2 right-2 bg-primary text-white">
                    {product.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                      {product.organic && (
                        <Badge variant="outline" className="text-green-600">
                          Organic
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Per:</span>
                      <span>{product.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stock:</span>
                      <span>{product.stock} {product.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Farmer:</span>
                      <span className="font-medium">{product.farmer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;