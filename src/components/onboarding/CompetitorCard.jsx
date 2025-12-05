import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, ExternalLink, Trash2, Pencil, RotateCcw, X, Tag } from 'lucide-react';


export default function CompetitorCard({ competitor, onUpdate, onRemove, originalData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: competitor.name,
    domain: competitor.domain,
    brand_name_variations: competitor.brand_name_variations,
  });
  const [newProduct, setNewProduct] = useState('');

  const handleSave = () => {
    onUpdate({ ...competitor, ...editedData });
    setIsEditing(false);
  };

  const handleReset = async () => {
    setEditedData(originalData);
    onUpdate({ ...competitor, ...originalData });
  };

  const handleAddProduct = () => {
    if (!newProduct.trim()) return;
    const updatedProducts = [...editedData.brand_name_variations, newProduct.trim()];
    setEditedData({ ...editedData, brand_name_variations: updatedProducts });
    setNewProduct('');
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = editedData.brand_name_variations.filter((_, i) => i !== index);
    setEditedData({ ...editedData, brand_name_variations: updatedProducts });
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white border-2 border-[#1E8B8B] rounded-xl">
        <div className="space-y-3 mb-4">
          <Input
            value={editedData.name}
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            placeholder="Company name"
            className="font-medium"
          />
          <Input
            value={editedData.domain}
            onChange={(e) => setEditedData({ ...editedData, domain: e.target.value })}
            placeholder="Website URL"
          />
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Product Names</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()}
                placeholder="Add product name"
                className="flex-1"
              />
              <Button
                onClick={handleAddProduct}
                size="sm"
                style={{ background: 'linear-gradient(to right, #1E8B8B, #C6DE41)' }}
                className="text-white"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedData.brand_name_variations.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-sm"
                >
                  <span>{product}</span>
                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1 bg-[#1E8B8B] hover:bg-[#1E8B8B]/90">
            Save
          </Button>
          {originalData && (
            <Button onClick={handleReset} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
          <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-[#1E8B8B] flex-shrink-0" />
          <span className="font-medium text-gray-900 truncate">{competitor.name}</span>
        </div>
        {competitor.domain && (
          <a
            href={competitor.domain}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-[#1E8B8B] flex items-center gap-1 w-fit mb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate">{competitor.domain}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        )}
        {competitor.brand_name_variations && competitor.brand_name_variations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {competitor.brand_name_variations.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200"
              >
                <Tag className="w-3 h-3 text-[#1E8B8B]" />
                <span>{product}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-[#1E8B8B] hover:bg-[#1E8B8B]/10"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(competitor.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}