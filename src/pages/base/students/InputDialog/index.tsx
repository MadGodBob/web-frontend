/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-16 20:41:30
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-17 23:20:03
 * @FilePath: \web-frontend-master\src\pages\base\students\InputDialog\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ModalForm, ProForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addStudent, updateStudent } from '@/services/api/students';
import { listClassId, listClassName } from '@/services/api/classes';

interface InputDialogProps {
  detailData?: API.StudentsDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export const ids = await listClassId();
export const names = await listClassName();

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);

  
  interface option {
    value: string;
    label: string;
  }
  const classIdList:option[] = Array();
  const classNameList:option[] = Array();
  ids?.forEach(function (id) {
    const classId:option = { value: id, label: id }
    classIdList.push(classId)
  });
  names?.forEach(function (name) {
    const className:option = { value: name, label: name }
    classNameList.push(className)
  });

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
    const { name,studentid,classId, className } = values;
    const data: API.StudentsDTO = {
      name,
      studentid,
      classId, 
      className
    };

    try {
      if (props.detailData) {
        await updateStudent(data, { throwError: true });
      } else {
        await addStudent(data, { throwError: true });
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
      title={props.detailData ? '修改学生信息' : '新增学生'}
      open={props.visible}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入学生姓名！',
            },
          ]}
        />
        <ProFormText
          name="studentid"
          label="学号"
          disabled={props.detailData?.studentid != null}
          rules={[
            {
              required: true,
              message: '请输入学号(9位)！',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
            width="sm"
            options={classIdList}
            name="classId"
            label="班级ID"
            rules={[{ required: true, message: '请输入班级ID!' }]}
            placeholder='请选择班级ID'
        />
        <ProFormSelect
            width="sm"
            options={classNameList}
            name="className"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称!' }]}
            placeholder='请选择班级名称'
        />
        </ProForm.Group>
    </ModalForm>
  );
}
