// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import { HfInference } from '@huggingface/inference';
// import Config from 'react-native-config';
// import { HF_API_KEY } from '@env';
// const hf = new HfInference();

// const Infor: React.FC = () => {
//   const [inputText, setInputText] = useState('');
//   const [generatedText, setGeneratedText] = useState('');
//   const generateText = async () => {
//     console.log('hf', HF_API_KEY);
//     try {
//       const response = await hf.textGeneration({
//         model: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
//         inputs: inputText,
//       });

//       setGeneratedText(response.generated_text);
//     } catch (error) {
//       console.error('Error generating text:', error);
//       setGeneratedText('Lỗi khi gọi API!');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Hugging Face Llama-3 Generator</Text>
//       <TextInput
//         style={styles.input}
//         value={inputText}
//         onChangeText={setInputText}
//         placeholder="Nhập nội dung..."
//         multiline
//       />
//       <Button title="Generate" onPress={generateText} />
//       <Text style={styles.result}>Kết quả: {generatedText}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     height: 100,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 10,
//     borderRadius: 5,
//   },
//   result: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Infor;
