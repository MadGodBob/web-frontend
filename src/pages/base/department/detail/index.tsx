/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-16 08:43:39
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-17 08:58:27
 * @FilePath: \web-frontend-master\src\pages\base\department\detail\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getDepartment, updateDepartment } from '@/services/api/department';

import { PageContainer, ProForm, ProFormText, ProFormInstance } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState, useRef } from 'react';
export default () => {
  const [searchParams] = useSearchParams();
  const form = useRef<ProFormInstance>(null);
  const id: any = searchParams.get('id') || '';
  const [department, setDepartment] = useState<API.DepartmentDTO>();

  useEffect(() => {
    getDepartment({ id }).then((result) => {
      setDepartment(result || {});
      form?.current?.setFieldsValue(result);
    });
  }, []);
  const onFinish = async (values: any) => {
    const { departmentName, description, contact, contactPhone } = values;
    const data: API.DepartmentDTO = {
      id,
      contact,
      departmentName,
      contactPhone,
      description,
    };

    try {
      await updateDepartment(data, { throwError: true });
      message.success('保存成功');
      history.push('/base/department');
    } catch (ex) {
      return true;
    }
    return true;
  };
  return (
    <PageContainer>
      <ProForm formRef={form} onFinish={(values) => onFinish(values)}>
        <ProFormText
          name="departmentName"
          label="部门名称"
          rules={[
            {
              required: true,
              message: '请输入部门名称！',
            },
          ]}
        />
        <ProForm.Group>
          <ProFormText
            name="contact"
            label="联系人"
            rules={[
              {
                required: true,
                message: '请输入联系人名称！',
              },
            ]}
          />
          <ProFormText
            name="contactPhone"
            label="联系电话"
            rules={[
              {
                required: true,
                message: '请输入联系人名称！',
              },
            ]}
          />
        </ProForm.Group>
        <ProFormText name="description" label="备注" />
      </ProForm>
    </PageContainer>
  );
};
