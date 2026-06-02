import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: '',
    category: 'vegetables',
    subcategory: '',
    isOrganic: false,
    isFresh: true,
    weight: '',
    origin: '',
    harvestDate: '',
    expiryDate: '',
    storageInstructions: '',
    preparationInstructions: '',
    images: []
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        unit: product.unit || 'kg',
        stockQuantity: product.stock_quantity || 0,
        minOrderQuantity: product.min_order_quantity || 1,
        maxOrderQuantity: product.max_order_quantity || '',
        category: product.category || 'vegetables',
        subcategory: product.subcategory || '',
        isOrganic: product.is_organic || false,
        isFresh: product.is_fresh !== false,
        weight: product.weight || '',
        origin: product.origin || '',
        harvestDate: product.harvest_date || '',
        expiryDate: product.expiry_date || '',
        storageInstructions: product.storage_instructions || '',
        preparationInstructions: product.preparation_instructions || '',
        images: product.images || []
      });
    }
  }, [product]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to appropriate types
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      minOrderQuantity: parseInt(formData.minOrderQuantity),
      maxOrderQuantity: formData.maxOrderQuantity ? parseInt(formData.maxOrderQuantity) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      harvestDate: formData.harvestDate || null,
      expiryDate: formData.expiryDate || null
    };

    onSubmit(submitData);
  };

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' }
  ];

  const units = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'lb', label: 'Pound (lb)' },
    { value: 'piece', label: 'Piece' },
    { value: 'bunch', label: 'Bunch' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'pack', label: 'Pack' }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="e.g., Fresh Tomatoes"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              placeholder="Describe your product..."
              rows={3}
            />
          </div>

          {/* Category and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => handleChange('stockQuantity', e.target.value)}
                required
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
              <Input
                id="minOrderQuantity"
                type="number"
                value={formData.minOrderQuantity}
                onChange={(e) => handleChange('minOrderQuantity', e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="maxOrderQuantity">Max Order Quantity</Label>
              <Input
                id="maxOrderQuantity"
                type="number"
                value={formData.maxOrderQuantity}
                onChange={(e) => handleChange('maxOrderQuantity', e.target.value)}
                min="1"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="e.g., Local Farm"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <Input
                id="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={(e) => handleChange('harvestDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storageInstructions">Storage Instructions</Label>
              <Textarea
                id="storageInstructions"
                value={formData.storageInstructions}
                onChange={(e) => handleChange('storageInstructions', e.target.value)}
                placeholder="How to store this product..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="preparationInstructions">Preparation Instructions</Label>
              <Textarea
                id="preparationInstructions"
                value={formData.preparationInstructions}
                onChange={(e) => handleChange('preparationInstructions', e.target.value)}
                placeholder="How to prepare this product..."
                rows={2}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOrganic"
                checked={formData.isOrganic}
                onCheckedChange={(checked) => handleChange('isOrganic', checked)}
              />
              <Label htmlFor="isOrganic">Organic Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFresh"
                checked={formData.isFresh}
                onCheckedChange={(checked) => handleChange('isFresh', checked)}
              />
              <Label htmlFor="isFresh">Fresh Product</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
