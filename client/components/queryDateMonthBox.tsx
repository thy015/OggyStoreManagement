import { MessageCircleQuestion } from "lucide-react-native"
import { View, Text } from "react-native"

const QueryDateMonthBox = () => {
  return (
    <View className="flex justify-center items-center mt-3">
        <View className="bg-white w-[90%] h-32 rounded-lg">
            <View className="p-4 flex flex-row">
            <Text className="text-lg font-poppinsLight mr-2">Conduct queries</Text>
            <MessageCircleQuestion color={'#a4a0a0'}></MessageCircleQuestion>
            </View>
        {/*    Query box*/}
          <View className='flex flex-row p-4 '>
            <View className='w-[45%] mr-4 bg-white shadow-sm h-8'>
              <Text className='p-2'>From</Text>
            </View>

            <View className='w-[45%] bg-white shadow-sm h-8'>
              <Text className='p-2'>To</Text>
            </View>
          </View>
        </View>
    </View>
  )
}

export default QueryDateMonthBox
