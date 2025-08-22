import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  className?: string;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  backgroundColor = '#ffffff',
  statusBarStyle = 'dark-content',
  className = '',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className={className}
    >
      {children}
    </View>
  );
};

export default SafeAreaWrapper;
