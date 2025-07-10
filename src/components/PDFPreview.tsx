import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Linking,
  Alert,
  Share,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface PDFPreviewProps {
  visible: boolean;
  onClose: () => void;
  fileUri: string;
  fileName: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  visible,
  onClose,
  fileUri,
  fileName,
}) => {
  console.log('fileUri', fileUri);
    const handleOpenPDF = async () => {
    try {
      console.log('Attempting to open PDF with URI:', fileUri);
      
      // For content URIs (Android document provider), we need to handle them differently
      if (fileUri.startsWith('content://')) {
        // Try to open with content URI directly
        const canOpen = await Linking.canOpenURL(fileUri);
        if (canOpen) {
          await Linking.openURL(fileUri);
          return;
        }
        
        // If direct opening fails, try with different MIME type
        const contentUri = `${fileUri}#application/pdf`;
        await Linking.openURL(contentUri);
        return;
      }
      
      // For regular file URIs
      if (fileUri.startsWith('file://')) {
        await Linking.openURL(fileUri);
        return;
      }
      
      // For other cases, try with file:// protocol
      const fileUrl = `file://${fileUri}`;
      await Linking.openURL(fileUrl);
      
    } catch (error) {
      console.error('Error opening PDF:', error);
      
      // Try using Share API as fallback for content URIs
      if (fileUri.startsWith('content://')) {
        try {
          await Share.share({
            url: fileUri,
            title: fileName,
            message: `Sharing PDF: ${fileName}`,
          });
          return;
        } catch (shareError) {
          console.error('Share API also failed:', shareError);
        }
      }
      
      // Show more specific error message
      Alert.alert(
        'Error Opening PDF',
        'Unable to open this PDF file. This might be due to:\n\n• No PDF viewer app installed\n• File permissions\n• Unsupported file format\n\nTry installing a PDF viewer app like Adobe Reader or Google Drive.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Install PDF Viewer', 
            onPress: () => {
              // Open app store for PDF viewer
              Linking.openURL('market://search?q=pdf+viewer');
            }
          }
        ],
      );
    }
  };

  const handleSharePDF = async () => {
    try {
      await Share.share({
        url: fileUri,
        title: fileName,
        message: `Sharing PDF: ${fileName}`,
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert('Error', 'Unable to share the PDF file.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1 }}>
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#333',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {fileName}
            </Text>
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
          </View>

          {/* PDF Content */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              backgroundColor: '#f8f9fa',
            }}
          >
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 24,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
                maxWidth: 300,
                width: '100%',
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#f0f8ff',
                  borderRadius: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Feather name="file-text" size={40} color="#3B82F6" />
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#333',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {fileName}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 20,
                }}
              >
                Tap the button below to open this PDF file in your device's
                default PDF viewer
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleOpenPDF}
                  style={{
                    backgroundColor: '#3B82F6',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <Feather name="external-link" size={16} color="#fff" />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    Open PDF
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSharePDF}
                  style={{
                    backgroundColor: '#10B981',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <Feather name="share-2" size={16} color="#fff" />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  marginTop: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: '#666',
                    fontSize: 14,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PDFPreview;
