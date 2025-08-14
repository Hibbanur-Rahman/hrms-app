import React from 'react';
import { 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Users, 
  GraduationCap, 
  School, 
  Hash, 
  Mail,
  Calendar,
  MapPin
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudentDetails = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { student } = (route.params as any) || {};

  if (!student) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg" style={{ fontFamily: 'Poppins-Medium' }}>
            Student not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const DetailRow = ({ icon: Icon, label, value, iconColor = "#9CA3AF" }: any) => {
    if (!value) return null;
    
    return (
      <View className="flex-row items-center py-4 border-b border-gray-100">
        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
          <Icon size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
            {label}
          </Text>
          <Text className="text-gray-800 text-base font-medium" style={{ fontFamily: 'Poppins-Medium' }}>
            {value}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-gray-100 rounded-full p-2"
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text
            className="text-gray-900 text-xl font-semibold"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Student Details
          </Text>
          <View className="w-9" />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="items-center mb-6">
            {student.image ? (
              <Image
                source={{ uri: student.image }}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                <User size={32} color="#9CA3AF" />
              </View>
            )}
            <Text 
              className="text-gray-800 text-2xl font-bold mt-4"
              style={{ fontFamily: 'Poppins-Bold' }}
            >
              {student.name}
            </Text>
            <View className="bg-blue-100 px-4 py-2 rounded-full mt-2">
              <Text 
                className="text-blue-600 text-sm font-medium"
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                {student.studentId}
              </Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text 
            className="text-gray-800 text-lg font-semibold mb-4"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Personal Information
          </Text>
          
          <DetailRow 
            icon={Phone} 
            label="Phone Number" 
            value={student.phone}
            iconColor="#22C55E"
          />
          
          <DetailRow 
            icon={User} 
            label="Gender" 
            value={student.gender}
            iconColor="#8B5CF6"
          />
          
          <DetailRow 
            icon={Calendar} 
            label="Role" 
            value={student.role}
            iconColor="#F59E0B"
          />
        </View>

        {/* Academic Information */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text 
            className="text-gray-800 text-lg font-semibold mb-4"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Academic Information
          </Text>
          
          <DetailRow 
            icon={GraduationCap} 
            label="Present Class" 
            value={student.presentClass}
            iconColor="#3B82F6"
          />
          
          <DetailRow 
            icon={GraduationCap} 
            label="Curriculum" 
            value={student.curriculum}
            iconColor="#06B6D4"
          />
          
          <DetailRow 
            icon={School} 
            label="School Name" 
            value={student.schoolName}
            iconColor="#EF4444"
          />
        </View>

        {/* Parent Information */}
        {(student.parentName || student.parentNumber) && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text 
              className="text-gray-800 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Parent Information
            </Text>
            
            <DetailRow 
              icon={Users} 
              label="Parent Name" 
              value={student.parentName}
              iconColor="#10B981"
            />
            
            <DetailRow 
              icon={Phone} 
              label="Parent Number" 
              value={student.parentNumber}
              iconColor="#22C55E"
            />
          </View>
        )}

        {/* Fee Structure */}
        {student.feeStructure && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text 
              className="text-gray-800 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Fee Structure
            </Text>
            
            <View className="space-y-3">
              {student.feeStructure.tuitionFee > 0 && (
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
                    Tuition Fee
                  </Text>
                  <Text className="text-gray-800 font-medium" style={{ fontFamily: 'Poppins-Medium' }}>
                    ₹{student.feeStructure.tuitionFee}
                  </Text>
                </View>
              )}
              
              {student.feeStructure.transportFee > 0 && (
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-gray-600" style={{ fontFamily: 'Poppins-Regular' }}>
                    Transport Fee
                  </Text>
                  <Text className="text-gray-800 font-medium" style={{ fontFamily: 'Poppins-Medium' }}>
                    ₹{student.feeStructure.transportFee}
                  </Text>
                </View>
              )}
              
              {student.feeStructure.totalFee > 0 && (
                <View className="flex-row justify-between items-center py-2 border-t border-gray-200 pt-3">
                  <Text className="text-gray-800 font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    Total Fee
                  </Text>
                  <Text className="text-blue-600 font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                    ₹{student.feeStructure.totalFee}
                  </Text>
                </View>
              )}
              
              {student.feeStructure.finalAmount > 0 && (
                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-green-600 font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    Final Amount
                  </Text>
                  <Text className="text-green-600 font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                    ₹{student.feeStructure.finalAmount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Added By Information */}
        {student.addedBy && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text 
              className="text-gray-800 text-lg font-semibold mb-4"
              style={{ fontFamily: 'Poppins-SemiBold' }}
            >
              Added By
            </Text>
            
            <DetailRow 
              icon={User} 
              label="Name" 
              value={student.addedBy.name}
              iconColor="#6366F1"
            />
            
            <DetailRow 
              icon={Mail} 
              label="Email" 
              value={student.addedBy.email}
              iconColor="#F59E0B"
            />
            
            <DetailRow 
              icon={Hash} 
              label="Role" 
              value={student.addedBy.role}
              iconColor="#8B5CF6"
            />
          </View>
        )}

        {/* Status Information */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text 
            className="text-gray-800 text-lg font-semibold mb-4"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Status
          </Text>
          
          <View className="flex-row flex-wrap gap-2">
            <View className={`px-3 py-2 rounded-full ${student.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text 
                className={`text-sm font-medium ${student.isActive ? 'text-green-600' : 'text-red-600'}`}
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                {student.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
            
            <View className={`px-3 py-2 rounded-full ${student.isVerified ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <Text 
                className={`text-sm font-medium ${student.isVerified ? 'text-blue-600' : 'text-yellow-600'}`}
                style={{ fontFamily: 'Poppins-Medium' }}
              >
                {student.isVerified ? 'Verified' : 'Not Verified'}
              </Text>
            </View>
            
            {student.isBlocked && (
              <View className="px-3 py-2 rounded-full bg-red-100">
                <Text 
                  className="text-sm font-medium text-red-600"
                  style={{ fontFamily: 'Poppins-Medium' }}
                >
                  Blocked
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Timestamps */}
        <View className="bg-white mx-4 mt-4 mb-4 rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text 
            className="text-gray-800 text-lg font-semibold mb-4"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Timestamps
          </Text>
          
          <DetailRow 
            icon={Calendar} 
            label="Created At" 
            value={new Date(student.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            iconColor="#6B7280"
          />
          
          <DetailRow 
            icon={Calendar} 
            label="Updated At" 
            value={new Date(student.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            iconColor="#6B7280"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDetails;