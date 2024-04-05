/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-16 20:41:30
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-26 14:13:40
 * @FilePath: \web-frontend-master\src\pages\base\students\InputDialog\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ActionType, ModalForm, ProForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Form, Space, Switch, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { waitTime } from '@/utils/request';
import { addStudent, updateStudent } from '@/services/api/students';
import TextArea from 'antd/es/input/TextArea';
import { downloadFile, submit } from '@/services/api/submission';
import { useModel } from '@umijs/max';
import Upload from 'antd/es/upload/Upload';

interface InputDialogProps {
  detailData?: API.ClassTaskDTO;
  studentId?: number;
  studentName?: string;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const { initialState, setInitialState } = useModel('@@initialState');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const refAction = useRef<ActionType>(null);
  const form = useRef<ProFormInstance>(null);
  const [answer_, setAnswer] = useState<string>("");
  const [ifFile, setIfFile] = useState(false);
  
  const getAnswer = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async () => {
    const data: API.SubmissionDTO = {
      name : props.studentName,
      studentid : props.studentId,
      classId : props.detailData?.classId, 
      className : props.detailData?.className, 
      taskId : props.detailData?.taskId, 
      answer : answer_
    };

    if (!answer_ && !ifFile){message.error("答案不能为空!");return;}

    try {
      if (ifFile){if(!(await onFile())){return;};}
      await submit(data, { throwError: true });
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('提交成功');
    refAction.current?.reload();
    return true;
  };

  const onFile = async () => {
    if (!props.detailData?.taskId) return;
    if (!inputFileRef?.current?.files?.length) {
      message.error('请选择文件');
      return false;
    }
    const formData = new FormData();
    formData.append('file', inputFileRef.current?.files[0])
    formData.append('taskId', `${props.detailData?.taskId}`)
    formData.append('studentId', `${initialState?.currentToken?.userCode}`)
    formData.append('name', `${initialState?.currentToken?.userName}`)
    let result = await fetch('api/submission/uploadFile', {
      method: 'POST',
      body: formData,
    })

    const data = {
      taskId : "0",
      studentId : 0,
    }
    
    if (result){
      // props.onClose(true);
      // message.success('提交成功');
      // refAction.current?.reload();
      return true;
    }
    
    return false;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      layout="horizontal"
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={"提交作业("+props.detailData?.taskId+")"}
      open={props.visible}
    >
      <div>问题：{props.detailData?.taskDescription}</div>
      <TextArea rows={10} allowClear onChange={getAnswer} placeholder='输入你的答案'/>
      <Space>
        <div>文件:</div>
        <Switch
              size="default"
              checkedChildren="ON" 
              unCheckedChildren="OFF" 
              onClick={() => {
                if(ifFile==true){setIfFile(false);}
                else{setIfFile(true);}
              }} 
              defaultChecked={ifFile}
        />
      </Space>
      <Form.Item rules={[{ required: ifFile, message: '请选择上传文件' }]}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {ifFile && <input type="file" ref={inputFileRef} style={{ flex: 1 }}/>}
        </div>
      </Form.Item>
      <Button ghost type='link' disabled>●只有一次提交机会</Button>
    </ModalForm>
  );
}
