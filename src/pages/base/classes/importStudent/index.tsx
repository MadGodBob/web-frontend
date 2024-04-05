import { getClass, importStudent } from '@/services/api/classes';
import { listStudents } from '@/services/api/students';
import { convertPageData } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { PageContainer, ProForm, ProFormText, ProFormInstance, ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { Button, message } from 'antd';
import { orderBy } from 'lodash';
import { useEffect, useState, useRef } from 'react';
export default () => {
  const refAction = useRef<ActionType>(null);
  const [selectedRowKeys, selectRow] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const form = useRef<ProFormInstance>(null);
  const classId: string = searchParams.get('classId') || '';
  const className: string = searchParams.get('className') || '';
  const studentid = undefined;
  const [searchProps, setSearchProps] = useState<API.StudentsQueryDTO>({});

  const columns: ProColumns<API.StudentsDTO>[] = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 50,
        search: false,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
    {
        title: '学号',
        dataIndex: 'studentid',
        width: 100,
    },
    {
        title: '班级ID',
        dataIndex: 'classId',
        width: 100,
        search: false,
      },
    {
        title: '班级名称',
        dataIndex: 'className',
        width: 100,
        search: false,
    },
]

  const data: API.StudentToClassDTO = {
    ids : undefined,
    classesDTO : undefined,
  }
  const dto: API.ClassesDTO = {
    classId,
    className
  }
  dto.classId = classId
  dto.className = className
  data.classesDTO = dto
  data.ids = selectedRowKeys

  const importStudents = async () => {
    if (!selectedRowKeys?.length) return;
    openConfirm(`您确定导入${selectedRowKeys.length}个学生到${className}吗`, async () => {
      await importStudent(data);
      refAction.current?.reload();
    });
  };

  return (
    <PageContainer>
        <ProTable<API.StudentsDTO>
            actionRef={refAction}
            rowKey="id"
            request={async (params = {}, sort) => {
                const props = {
                  ...params,
                  orderBy: orderBy(sort),
                };
                setSearchProps(props);
                return convertPageData(await listStudents(props));
            }}
            toolBarRender={() => [
                <Button disabled>
                  {classId}
                </Button>,
                <Button disabled>
                  {className}
                </Button>,
                <Button
                  type="primary"
                  key="primary"
                  onClick={importStudents}
                >
                  <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 导入该班级
                </Button>,
              ]}
              columns={columns}
              rowSelection={{
                onChange: (rowKeys) => {
                  selectRow(rowKeys as number[]);
                },
              }}
        />

    </PageContainer>
    )
};
