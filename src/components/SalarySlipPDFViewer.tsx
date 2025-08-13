import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Linking,
  Alert,
  Share,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface SalarySlipPDFViewerProps {
  visible: boolean;
  onClose: () => void;
  fileUri: string;
  fileName: string;
  salarySlipId?: string;
}

const SalarySlipPDFViewer: React.FC<SalarySlipPDFViewerProps> = ({
  visible,
  onClose,
  fileUri,
  fileName,
  salarySlipId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = async () => {
    try {
      // Request storage permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs storage permission to download salary slip',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Storage permission is required to download files');
          return;
        }
      }

      Alert.alert('Download Started', 'Your salary slip is being downloaded...');
      
      // Generate filename with current date
      const currentDate = new Date();
      const downloadFileName = `${fileName}_${currentDate.getTime()}.pdf`;
      
      // Configure download path
      const { fs } = ReactNativeBlobUtil;
      const downloads = fs.dirs.DownloadDir;
      const downloadPath = `${downloads}/${downloadFileName}`;
      
      // Copy from cache to downloads folder
      await fs.cp(fileUri.replace('file://', ''), downloadPath);
      
      Alert.alert(
        'Download Complete', 
        `Salary slip downloaded successfully to Downloads folder as ${downloadFileName}`,
        [
          {
            text: 'Open Folder',
            onPress: () => {
              // Open downloads folder
              if (Platform.OS === 'android') {
                Linking.openURL('content://com.android.externalstorage.documents/document/primary%3ADownload');
              }
            },
          },
          { text: 'OK' },
        ]
      );
    } catch (error: any) {
      console.log("error while downloading:", error);
      Alert.alert(
        'Download Failed',
        'Failed to download salary slip'
      );
    }
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'android') {
        // For Android, use the file URI directly since we're using FileProvider
        await Share.share({
          url: fileUri,
          title: fileName,
          message: `Sharing salary slip: ${fileName}`,
        });
      } else {
        // For iOS
        await Share.share({
          url: fileUri,
          title: fileName,
          message: `Sharing salary slip: ${fileName}`,
        });
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Unable to share the PDF file.');
    }
  };

  const handleOpenInExternalApp = async () => {
    try {
      if (Platform.OS === 'android') {
        // Use react-native-blob-util's android method to open files safely
        const filePath = fileUri.replace('file://', '');
        await ReactNativeBlobUtil.android.actionViewIntent(filePath, 'application/pdf');
      } else {
        // For iOS, check if we can open the file
        const canOpen = await Linking.canOpenURL(fileUri);
        if (canOpen) {
          await Linking.openURL(fileUri);
        } else {
          throw new Error('Cannot open file URL');
        }
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      
      // Fallback: Try to share the file instead
      try {
        await handleShare();
      } catch (shareError) {
        console.error('Share also failed:', shareError);
        Alert.alert(
          'Cannot Open File',
          'Unable to open this PDF file. This might be due to:\n\n• No PDF viewer app installed\n• File permissions\n• Unsupported file format\n\nTry installing a PDF viewer app like Adobe Reader or Google Drive.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Install PDF Viewer', 
              onPress: () => {
                // Open app store for PDF viewer
                const storeUrl = Platform.OS === 'android' 
                  ? 'market://search?q=pdf+viewer'
                  : 'https://apps.apple.com/search?term=pdf+viewer';
                Linking.openURL(storeUrl);
              }
            }
          ],
        );
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            backgroundColor: '#fff',
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#f0f0f0',
            }}
          >
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
          
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#333',
              flex: 1,
              textAlign: 'center',
              marginHorizontal: 16,
            }}
            numberOfLines={1}
          >
            {fileName}
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#f0f0f0',
              }}
            >
              <Feather name="share-2" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDownload}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#f0f0f0',
              }}
            >
              <Feather name="download" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleOpenInExternalApp}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: '#f0f0f0',
              }}
            >
              <Feather name="external-link" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* PDF Viewer */}
        <View style={{ flex: 1 }}>
          {fileUri ? (
            <Pdf
              source={{ uri: fileUri }}
              onLoadComplete={(numberOfPages) => {
                setTotalPages(numberOfPages);
                setIsLoading(false);
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page) => {
                setCurrentPage(page);
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
                setIsLoading(false);
                Alert.alert('Error', 'Unable to load PDF file');
              }}
              onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
              enablePaging={true}
              enableRTL={false}
              enableAnnotationRendering={true}
              password=""
              spacing={0}
              enableDoubleTapZoom={true}
              maxScale={3}
              minScale={0.5}
            />
          ) : (
            <View style={{ 
              flex: 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: 20 
            }}>
              <Feather name="file-text" size={48} color="#ccc" />
              <Text style={{ 
                marginTop: 16, 
                fontSize: 16, 
                color: '#666',
                textAlign: 'center' 
              }}>
                No PDF file to display
              </Text>
            </View>
          )}
        </View>

        {/* Footer with page info */}
        {totalPages > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ fontSize: 14, color: '#666' }}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default SalarySlipPDFViewer;
