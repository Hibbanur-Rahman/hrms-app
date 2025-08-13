import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  Settings,
  Trash2,
  User,
  Calendar,
  AlertCircle,
  Info,
  Check,
  X,
  FileText,
  CreditCard,
  MapPin,
  MessageSquare,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import Animated, {
  FadeInUp,
  Layout,
} from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'expense' | 'project' | 'system' | 'reminder';
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  avatar?: string;
  actionData?: any;
}

const Notifications = () => {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock data - Replace with actual API call
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        title: 'Leave Request Approved',
        message: 'Your leave request for Dec 25-27 has been approved by your manager.',
        type: 'leave',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
        priority: 'high',
      },
      {
        id: '2',
        title: 'Check-in Reminder',
        message: 'Don\'t forget to check in for today\'s work session.',
        type: 'attendance',
        timestamp: '2024-01-15T09:00:00Z',
        isRead: false,
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Expense Report Submitted',
        message: 'Your expense report #EXP-2024-001 has been submitted for review.',
        type: 'expense',
        timestamp: '2024-01-14T16:45:00Z',
        isRead: true,
        priority: 'low',
      },
      {
        id: '4',
        title: 'New Project Assignment',
        message: 'You have been assigned to the Mobile App Development project.',
        type: 'project',
        timestamp: '2024-01-14T14:20:00Z',
        isRead: true,
        priority: 'high',
      },
      {
        id: '5',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 11 PM to 2 AM.',
        type: 'system',
        timestamp: '2024-01-14T11:00:00Z',
        isRead: true,
        priority: 'medium',
      },
      {
        id: '6',
        title: 'Salary Slip Available',
        message: 'Your salary slip for December 2023 is now available for download.',
        type: 'system',
        timestamp: '2024-01-13T12:00:00Z',
        isRead: false,
        priority: 'medium',
      },
    ];
    setNotifications(mockNotifications);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      loadNotifications();
      setRefreshing(false);
    }, 1000);
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconColor = priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#6b7280';
    const iconSize = 20;

    switch (type) {
      case 'leave':
        return <Calendar size={iconSize} color={iconColor} />;
      case 'attendance':
        return <Clock size={iconSize} color={iconColor} />;
      case 'expense':
        return <CreditCard size={iconSize} color={iconColor} />;
      case 'project':
        return <FileText size={iconSize} color={iconColor} />;
      case 'system':
        return <Settings size={iconSize} color={iconColor} />;
      case 'reminder':
        return <Bell size={iconSize} color={iconColor} />;
      default:
        return <Info size={iconSize} color={iconColor} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'leave':
        return { bg: '#dcfce7', border: '#16a34a' };
      case 'attendance':
        return { bg: '#dbeafe', border: '#3b82f6' };
      case 'expense':
        return { bg: '#fef3c7', border: '#f59e0b' };
      case 'project':
        return { bg: '#f3e8ff', border: '#8b5cf6' };
      case 'system':
        return { bg: '#f1f5f9', border: '#64748b' };
      case 'reminder':
        return { bg: '#fef2f2', border: '#ef4444' };
      default:
        return { bg: '#f3f4f6', border: '#9ca3af' };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
          },
        },
      ]
    );
  };

  const filteredNotifications = notifications.filter(notif =>
    filter === 'all' ? true : !notif.isRead
  );

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const NotificationCard = ({ notification, index }: { notification: NotificationItem; index: number }) => {
    const typeColors = getTypeColor(notification.type);
    
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        layout={Layout.springify()}
        className={`w-full rounded-2xl p-4 mb-3 border-l-4 ${
          notification.isRead ? 'bg-gray-50' : 'bg-white'
        }`}
        style={{
          borderLeftColor: typeColors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: notification.isRead ? 0.05 : 0.1,
          shadowRadius: 8,
          elevation: notification.isRead ? 1 : 3,
        }}
      >
        <TouchableOpacity
          onPress={() => markAsRead(notification.id)}
          activeOpacity={0.8}
        >
          <View className="flex-row items-start gap-3">
            {/* Icon */}
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: typeColors.bg }}
            >
              {getNotificationIcon(notification.type, notification.priority)}
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-1">
                <Text
                  className={`text-base font-semibold ${
                    notification.isRead ? 'text-gray-600' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: 'Poppins-SemiBold', flex: 1 }}
                >
                  {notification.title}
                </Text>
                {!notification.isRead && (
                  <View className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                )}
              </View>

              <Text
                className={`text-sm mb-2 ${
                  notification.isRead ? 'text-gray-500' : 'text-gray-700'
                }`}
                style={{ fontFamily: 'Poppins-Regular', lineHeight: 20 }}
              >
                {notification.message}
              </Text>

              <View className="flex-row items-center justify-between">
                <Text
                  className="text-xs text-gray-500"
                  style={{ fontFamily: 'Poppins-Regular' }}
                >
                  {formatTime(notification.timestamp)}
                </Text>

                <View className="flex-row items-center gap-2">
                  {notification.priority === 'high' && (
                    <View className="flex-row items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
                      <AlertCircle size={10} color="#ef4444" />
                      <Text
                        className="text-xs text-red-600"
                        style={{ fontFamily: 'Poppins-Medium' }}
                      >
                        High
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => deleteNotification(notification.id)}
                    className="p-1"
                  >
                    <Trash2 size={14} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-gray-100 rounded-full p-2"
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Text
              className="text-gray-900 text-xl font-semibold"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                <Text
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: 'Poppins-Bold' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className="bg-gray-100 rounded-full p-2"
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <CheckCircle size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mt-4 bg-gray-100 rounded-full p-1">
          <TouchableOpacity
            onPress={() => setFilter('all')}
            activeOpacity={0.7}
            className={`flex-1 py-2 px-4 rounded-full ${
              filter === 'all' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                filter === 'all' ? 'text-gray-900' : 'text-gray-600'
              }`}
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('unread')}
            activeOpacity={0.7}
            className={`flex-1 py-2 px-4 rounded-full ${
              filter === 'unread' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                filter === 'unread' ? 'text-gray-900' : 'text-gray-600'
              }`}
              style={{ fontFamily: 'Poppins-Medium' }}
            >
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      >
        {filteredNotifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Bell size={40} color="#9ca3af" />
            </View>
            <Text
              className="text-lg font-semibold text-gray-900 mb-2"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </Text>
            <Text
              className="text-gray-500 text-center px-8"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {filter === 'unread'
                ? 'All your notifications have been read'
                : 'You\'re all caught up! New notifications will appear here.'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              index={index}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;