import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export class PermissionHelper {
  /**
   * Request storage permission with enhanced handling for never_ask_again case
   */
  static async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true; // iOS doesn't need explicit storage permissions for app sandbox
    }

    // For Android 11+ (API 30+), scoped storage is used
    const androidVersion = typeof Platform.Version === 'number' 
      ? Platform.Version 
      : parseInt(String(Platform.Version));
    
    if (androidVersion >= 30) {
      // Android 11+ can write to app's external files directory without permissions
      return true;
    }

    try {
      // First check if permission is already granted
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      
      if (hasPermission) {
        return true;
      }

      // Request permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to storage to download files to your device.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'Allow',
        },
      );

      console.log('Storage permission result:', granted);

      switch (granted) {
        case PermissionsAndroid.RESULTS.GRANTED:
          return true;
          
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          this.showPermissionDeniedDialog();
          return false;
          
        default:
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to download files. Please try again and allow the permission.'
          );
          return false;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      Alert.alert('Error', 'Failed to request storage permission');
      return false;
    }
  }

  /**
   * Show dialog when permission is permanently denied
   */
  private static showPermissionDeniedDialog(): void {
    Alert.alert(
      'Permission Required',
      'Storage permission was permanently denied. To download files, please:\n\n1. Go to app settings\n2. Enable Storage permission\n3. Try downloading again',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert('Error', 'Could not open app settings');
            });
          },
        },
      ]
    );
  }

  /**
   * Get appropriate download directory based on Android version and permissions
   */
  static getDownloadPath(fs: any, fileName: string): { path: string; description: string } {
    const androidVersion = typeof Platform.Version === 'number' 
      ? Platform.Version 
      : parseInt(String(Platform.Version));

    if (Platform.OS === 'android' && androidVersion >= 30) {
      // Use app's external files directory for Android 11+
      return {
        path: `${fs.dirs.DocumentDir}/${fileName}`,
        description: 'app documents folder'
      };
    } else {
      // Use Downloads folder for older Android versions and iOS
      return {
        path: `${fs.dirs.DownloadDir}/${fileName}`,
        description: 'Downloads folder'
      };
    }
  }

  /**
   * Check if storage permission is available (not permanently denied)
   */
  static async isStoragePermissionAvailable(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    const androidVersion = typeof Platform.Version === 'number' 
      ? Platform.Version 
      : parseInt(String(Platform.Version));
    
    if (androidVersion >= 30) {
      return true; // Scoped storage available
    }

    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      
      if (hasPermission) {
        return true;
      }

      // Try to request permission to see if it's permanently denied
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Checking storage access...',
          buttonPositive: 'OK',
        },
      );

      return result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
    } catch (error) {
      console.error('Error checking storage permission:', error);
      return false;
    }
  }
}
