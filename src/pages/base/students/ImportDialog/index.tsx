/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-16 20:44:29
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-17 22:11:37
 * @FilePath: \web-frontend-master\src\pages\base\students\ImportDialog\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { UploadOutlined } from '@ant-design/icons';
import { ModalForm, ProFormInstance } from '@ant-design/pro-components';
import { Button, Form, Upload, message } from 'antd';
import { useRef } from 'react';

interface InputDialogProps {
  visible: boolean;
  onClose: (result?: number) => void;
}

export default (props: InputDialogProps) => {
  const form = useRef<ProFormInstance>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onFinish = async (values: any) => {
    if (!inputFileRef?.current?.files?.length) {
      message.error('请选择文件');
      return;
    }
    const formData = new FormData();
    formData.append('file', inputFileRef.current.files[0], inputFileRef.current.files[0].name);

    const result = await fetch('/api/students/addStudentFile', {
      method: 'POST',
      body: formData,
    });

    const json = await result.json();

    if (json?.success) {
      message.success(`上传成功，共导入${json?.data || 0}条数据`);
      props.onClose(json?.data || 0);
      return true;
    }

    message.error(json?.errorMessage);
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
        onCancel: () => props.onClose(undefined),
      }}
      title="导入学生数据"
      open={props.visible}
    >
      <Form.Item label="Excel文件：" rules={[{ required: true, message: '请选择上传文件' }]}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input type="file" ref={inputFileRef} style={{ flex: 1 }} />
        </div>
      </Form.Item>
      <div>●将自动添加学生表中的新班级</div>
    </ModalForm>
  );
};
