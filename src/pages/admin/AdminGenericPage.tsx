import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (item: Record<string, unknown>) => React.ReactNode;
}

interface Props {
  title: string;
  data: Record<string, unknown>[];
  columns: Column[];
}

export default function AdminGenericPage({ title, data, columns }: Props) {
  const [items, setItems] = useState(data);

  const toggleActive = (id: number) => {
    setItems(items.map(item =>
      (item.id as number) === id ? { ...item, isActive: !(item.isActive as boolean) } : item
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <button className="btn-primary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{col.label}</th>
                ))}
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Active</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <motion.tr
                  key={item.id as number}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">#{item.id as number}</td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(item) : String(item[col.key] ?? '-')}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(item.id as number)}>
                      {(item.isActive as boolean) ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
