/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-16 17:45:13
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-17 10:37:17
 * @FilePath: \web-frontend-master\src\pages\base\classes\InputDialog\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ModalForm, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addClass, updateClass } from '@/services/api/classes';

interface InputDialogProps {
  detailData?: API.ClassesDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async (values: any) => {
    const { classId, className, description } = values;
    const data: API.ClassesDTO = {
      classId,
      className,
      description,
    };

    try {
      if (props.detailData) {
        await updateClass(data, { throwError: true });
      } else {
        await addClass(data, { throwError: true });
      }
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('保存成功');
    return true;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.detailData ? '修改班级' : '新建班级'}
      open={props.visible}
    >
      <ProForm.Group>
        <ProFormText
          name="classId"
          label="班级ID"
          disabled={props.detailData?.classId != null}
          rules={[
            {
              required: true,
              message: '请输入班级ID！',
            },
          ]}
        />
        <ProFormText
          name="className"
          label="班级名称"
          rules={[
            {
              required: true,
              message: '请输入班级名称！',
            },
          ]}
        />
      </ProForm.Group>
      <ProFormText name="description" label="班级描述" />
    </ModalForm>
  );
}
