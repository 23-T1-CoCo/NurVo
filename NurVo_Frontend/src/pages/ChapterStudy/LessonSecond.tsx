import React, { useState, useRef, useEffect } from 'react'
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    NativeModules,
    TouchableOpacity,
    TextInput,
    Keyboard,
} from 'react-native';

import Colors from '../../utilities/Color';
import { Message, allMessages } from '../../utilities/LessonExample';
import { ChatBubbleInputWord } from '../../components/ChatBubble';
import CustomAlert from '../../components/Alert';

const { StatusBarManager } = NativeModules;

export default function LessonSecond({ navigation }: { navigation: any }) {

    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const [messages, setMessages] = useState<Message[]>([allMessages[0]]);
    const [inputText, setInputText] = useState('');
    const [correctPercent, setCorrectPercent] = useState('');
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [showNextAlert, setShowNextAlert] = useState(false);
    const [showCheckAlert, setShowCheckAlert] = useState(false);

    useEffect(() => {
        if (!showCheckAlert && messages[messages.length - 1].speaker === 'Nurse') {
            inputRef.current?.focus();
        }
    }, [showCheckAlert]);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }
        );
        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const handlePress = () => {
        if (messages.length < allMessages.length) {
            if (messages[messages.length - 1].speaker === 'Nurse' && messages[messages.length - 1].second_step) {
                
                if (inputText.trim().length === 0) {
                    inputRef.current?.focus();
                    return;
                } else {
                    console.log(inputText);
                    setShowCheckAlert(true);
                }
            } else {
                setMessages(allMessages.slice(0, messages.length + 1));
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        } else {
            setShowNextAlert(true);
        }
    };

    const handleSend = () => {
        handlePress();
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const handleNext = () => {
        navigation.pop();
        navigation.navigate("LessonThirdScreen");
    };
    const handleCancle = () => {
        setShowNextAlert(false);
    };
    const handleCheckNext = () => {
        setInputText('');
        setShowCheckAlert(false);
        setMessages(allMessages.slice(0, messages.length + 1));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };
    const handleCheckCancle = () => {
        setShowCheckAlert(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? StatusBarManager.HEIGHT + 44 : undefined}
        >
            <FlatList
                style={{ flex: 1, paddingHorizontal: 20 }}
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
                        <ChatBubbleInputWord 
                        item={item} 
                        isBookmarked={false} 
                        onEnterValue={handleSend} 
                        onChagneText={setInputText}
                        inputRef={inputRef}/>
                    </TouchableOpacity>
                )}
            />
            {showNextAlert &&
                <CustomAlert
                    onCancle={handleCancle}
                    onConfirm={handleNext}
                    content={`2단계 학습을 완료했습니다. \n3단계 학습을 시작하시겠습니까?`}
                    cancleText='취소'
                    confirmText='확인' />}
            {showCheckAlert &&
                <CustomAlert
                    onCancle={handleCheckCancle}
                    onConfirm={handleCheckNext}
                    content={`정답률이 %입니다. \n다음으로 넘어가시겠습니까?`}
                    cancleText='다시하기'
                    confirmText='넘어가기' />}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.BACKGROUND
    },
});

