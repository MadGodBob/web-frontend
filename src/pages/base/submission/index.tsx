import { convertPageData } from "@/utils/request";
import { openConfirm } from "@/utils/ui";
import { DeleteOutlined, PlusOutlined, RestFilled } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Link } from "@umijs/max";
import { Button, Select } from "antd"
import { orderBy, set } from "lodash";
import { useRef, useState } from "react";
import { listSubmissions, clear, deleteSubmission } from "@/services/api/submission";
import Display from "./Display";
import { listClassId, listClassName } from "@/services/api/classes";

export const ids = await listClassId();
export const names = await listClassName();

export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [submission, setSubmission] = useState<API.SubmissionDTO>();
    const [searchProps, setSearchProps] = useState<API.SubmissionQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const [classId, setClassId] = useState<string>();
    const [className, setClassName] = useState<string>();

    interface option {
      value: string;
      label: string;
    }
    const classIdList:option[] = Array();
    const classNameList:option[] = Array();
    var changeClassId = (value: string) => {
      setClassId(value);
      refAction.current?.reload();
    };
    const changeClassName = (value: string) => {
      setClassName(value);
      refAction.current?.reload();
    };
    ids?.forEach(function (id) {
      const classId:option = { value: id, label: id }
      classIdList.push(classId)
    });
    names?.forEach(function (name) {
      const className:option = { value: name, label: name }
      classNameList.push(className)
    });

    const columns: ProColumns<API.SubmissionDTO>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
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
        {
          title: '任务ID',
          dataIndex: 'taskId',
          width: 100,
        },
        {
          title: '提交时间',
          dataIndex: 'submitAt',
          width: 150,
          search:false,
        },
        {
            title: '操作',
            width: 50,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Button type="link" onClick={() => {setSubmission(record);setVisible(true);}}>查看提交结果</Button>,
            ],
        },
    ]

    const clearSubmission = async () => {
      openConfirm(`您确定清空整张作业提交表吗`, async () => {
        await clear();
        refAction.current?.reload();
      });
    };

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}个作业提交吗`, async () => {
          await deleteSubmission(selectedRowKeys);
          refAction.current?.reload();
        });
      };

    return (
    <PageContainer>
        <ProTable<API.SubmissionDTO>
            actionRef={refAction}
            rowKey="id"
            request={async (params = {}, sort) => {
                const props = {
                  ...params,
                  classId: classId,
                  className: className,
                  orderBy: orderBy(sort),
                };
                setSearchProps(props);
                return convertPageData(await listSubmissions(props));
            }}
            toolBarRender={() => [
                <Button type="primary" ghost onClick={() => {changeClassId("");changeClassName("");refAction.current?.reload();}}>
                  重置
                </Button>,
                <Select
                style={{ width: 120 }}
                value={classId ? classId : undefined}
                onChange={changeClassId}
                options={classIdList}
                placeholder='筛选班级ID'
                />,
                <Select
                style={{ width: 130 }}
                value={className ? className : undefined}
                onChange={changeClassName}
                options={classNameList}
                placeholder='筛选班级名称'
                />,
                <Button
                  type="primary"
                  key="primary"
                  ghost
                  danger
                  onClick={handleDelete}
                  disabled={!selectedRowKeys?.length}
                >
                  <DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 删除
                </Button>,
                <Button
                type="primary"
                key="primary"
                danger
                onClick={clearSubmission}
              >
                <RestFilled onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 清空提交列表
              </Button>,
              ]}
              columns={columns}
              rowSelection={{
                onChange: (rowKeys) => {
                  selectRow(rowKeys as number[]);
                },
              }}
        />

        <Display
        detailData={submission}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />

    </PageContainer>
    )
}