/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-04-03 21:18:04
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-04-03 21:28:57
 * @FilePath: \web-frontend-master\src\pages\base\classes\ListStudents\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ActionType, ModalForm, ProColumns, ProForm, ProFormInstance, ProFormText, ProTable } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { convertPageData, waitTime } from '@/utils/request';
import { orderBy } from 'lodash';
import { listStudents } from '@/services/api/students';

interface list {
  classId: string;
  className: string;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function ListStudents(props: list) {
  const refAction = useRef<ActionType>(null);

  const columns: ProColumns<API.StudentsVO>[] = [
    {
      title: '学号',
      dataIndex: 'studentid',
      width: 100,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
    {
        title: '班级ID',
        dataIndex: 'classId',
        width: 100,
      },
    {
        title: '班级名称',
        dataIndex: 'className',
        width: 100,
    },
]

  const onFinish = async (values: any) => {
    props.onClose(true);
    return true;
  };

  return (
    <ModalForm
      width={500}
      onFinish={onFinish}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.className}
      open={props.visible}
    >
      <ProTable<API.StudentsVO>
            actionRef={refAction}
            search={false}
            request={async (params = {}, sort) => {
                const data = {
                  ...params,
                  classId : props.classId,
                  orderBy: orderBy(sort),
                };
                data.keyword
                return convertPageData(await listStudents(data));
            }}
            columns={columns}
        />
        
    </ModalForm>
  );
}
