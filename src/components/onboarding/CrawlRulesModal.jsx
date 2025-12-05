import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Trash2, Shield } from 'lucide-react';

export default function CrawlRulesModal({ isOpen, onClose, rules = [], onSave }) {
  const [localRules, setLocalRules] = useState(rules);
  const [newPath, setNewPath] = useState('');
  const [newType, setNewType] = useState('allow');

  const handleAddRule = () => {
    if (!newPath.trim()) return;
    
    const rule = {
      type: newType,
      path: newPath.trim()
    };
    
    setLocalRules([...localRules, rule]);
    setNewPath('');
  };

  const handleRemoveRule = (index) => {
    setLocalRules(localRules.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(localRules);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-[#1E8B8B]" />
            Configure Crawl Rules
          </DialogTitle>
          <DialogDescription>
            Specify which sections of your website to track. Use paths like /blog, /products, etc.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Rule */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h3 className="font-medium text-gray-900">Add New Rule</h3>
            <div className="flex gap-2">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="allow">Allow</option>
                <option value="disallow">Disallow</option>
              </select>
              <Input
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                placeholder="/path/to/track"
                className="flex-1"
              />
              <Button
                onClick={handleAddRule}
                style={{
                  background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                }}
                className="text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Rules List */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Current Rules</h3>
            {localRules.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No rules added yet. All paths will be tracked by default.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {localRules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          rule.type === 'allow'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {rule.type}
                      </span>
                      <code className="text-sm text-gray-700 font-mono">{rule.path}</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRule(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Use <code className="bg-white px-1 rounded">/</code> to track all pages, or specify paths like <code className="bg-white px-1 rounded">/blog</code>, <code className="bg-white px-1 rounded">/products/*</code>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
            }}
            className="text-white"
          >
            Save Rules
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}