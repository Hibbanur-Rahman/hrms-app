import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Eye, Edit, Trash2 } from 'lucide-react-native';

interface SwipeActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({ onView, onEdit, onDelete }) => {
  return (
    <View className="flex-row items-center justify-end gap-2">
      <TouchableOpacity
        className="p-3 rounded-xl border border-blue-200"
        onPress={onView}
        activeOpacity={0.7}
      >
        <Eye size={18} color="#3B82F6" />
      </TouchableOpacity>
      
      <TouchableOpacity
        className="p-3 rounded-xl border"
        onPress={onEdit}
        activeOpacity={0.7}
        style={{ borderColor: '#f4ef50' }}
      >
        <Edit size={18} color="#F59E0B" />
      </TouchableOpacity>
      
      <TouchableOpacity
        className=" p-3 rounded-xl border border-red-200"
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Trash2 size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

export default SwipeActions;
