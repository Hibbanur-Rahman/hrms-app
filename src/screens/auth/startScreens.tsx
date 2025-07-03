import { useState } from 'react';

import { View, Text, Image, TouchableOpacity } from 'react-native';

const StartScreens = () => {

  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {

    setCurrentStep(currentStep+1);

  }

  const handlePrevious = () => {

    setCurrentStep(currentStep-1);

  }

  return (

    <View className="flex-1 bg-white">

        <View>

            {

                currentStep===1 && (

                    <Image source={require('../../assets/images/slide-img1.jpg')} className="h-100 w-100" resizeMode="contain" />

                )

            }

            {

                currentStep===2 && (

                    <Image source={require('../../assets/images/slide-img2.jpg')} className="h-100 w-100" resizeMode="contain" />

                )

            }

            {

                currentStep===3 && (

                        <Image source={require('../../assets/images/slide-img3.jpg')} className="h-100 w-100" resizeMode="contain" />

                )

            }

        </View>

      {currentStep === 1 && (

        <View className="flex-1 justify-center items-center">

          <Text className="text-2xl font-bold">Easy way to confirm your attendance</Text>

          <Text>It is long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>

        </View>

      )}

      {currentStep === 2 && (

        <View className="flex-1 justify-center items-center">

          <Text className="text-2xl font-bold">Disciplinary in your hand</Text>

          <Text>It is long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>

        </View>

      )}

      {currentStep === 3 && (

        <View className="flex-1 justify-center items-center">

          <Text className="text-2xl font-bold">Reduce the workload of HR management</Text>

          <Text>It is long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>

        </View>

      )}

      <View className="flex-1 justify-center items-center">

            <TouchableOpacity className="bg-[
#7563F7] rounded-full p-2" onPress={()=>setCurrentStep(currentStep+1)}>

            <Text className="text-white">Next</Text>

        </TouchableOpacity>

        <TouchableOpacity className="bg-[
#7563F7] rounded-full p-2" onPress={()=>handlePrevious()}>

            <Text className="text-white">Previous</Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};

export default StartScreens;

