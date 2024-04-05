import { convertPageData } from "@/utils/request";
import { openConfirm } from "@/utils/ui";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Link, useModel } from "@umijs/max";
import { Button, Progress, Select, Space } from "antd"
import { orderBy, set } from "lodash";
import { useRef, useState } from "react";
import InputDialog from "../students/InputDialog";
import { deleteStudent, listStudents } from "@/services/api/students";
import ImportDialog from "../students/ImportDialog";
import { listClassId, listClassName } from "@/services/api/classes";

export const ids = await listClassId();
export const names = await listClassName();

export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [importVisible, setImportVisible] = useState(false);
    const [students, setStudents] = useState<API.StudentsDTO>();
    const [searchProps, setSearchProps] = useState<API.StudentsQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const [classId, setClassId] = useState<string>();
    const [className, setClassName] = useState<string>();

    interface option {
      value: string;
      label: string;
    }
    const classIdList:option[] = Array();
    const classNameList:option[] = Array();
    const changeClassId = (value: string) => {
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
    const a:option[] = [{ value: '男', label: '女' }];

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
            width: 80,
            render: (dom, record) => {
              return (
                <a
                  onClick={() => {
                    setStudents(record);
                    setVisible(true);
                  }}
                >
                  {dom}
                </a>
              );
            },
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
          title: '作业完成进度',
          width: 200,
          search: false,
          render: (_, record) => {
            if(record.unSubmitted==0){return <Button type="link" disabled>未布置作业</Button>}
            var p:number = record.submitted!/record.unSubmitted! * 100;
            return (
                <Progress percent={Math.ceil(p)} />
            );
          },
      },
        {
            title: '操作',
            width: 50,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Button type="link" onClick={() => {setStudents(record);setVisible(true);}}>修改</Button>,
              ],
        },
    ]

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}个学生吗`, async () => {
          await deleteStudent(selectedRowKeys);
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
                  classId: classId,
                  className: className,
                  orderBy: orderBy(sort),
                };
                setSearchProps(props);
                return convertPageData(await listStudents(props));
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
                  onClick={() => {
                    setStudents(undefined);
                    setVisible(true);
                  }}
                >
                  <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 添加学生
                </Button>,
                <Button
                  type="primary"
                  key="primary"
                  danger
                  onClick={handleDelete}
                  disabled={!selectedRowKeys?.length}
                >
                  <DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 删除
                </Button>,
                <Button
                type="primary"
                key="primary"
                icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                onClick={() => {
                  setImportVisible(true);
                }}
              >
                导入
              </Button>,
              ]}
              columns={columns}
              rowSelection={{
                onChange: (rowKeys) => {
                  selectRow(rowKeys as number[]);
                },
              }}
        />

        <InputDialog
        detailData={students}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />

      <ImportDialog
        visible={importVisible}
        onClose={(count) => {
          setImportVisible(false);
          if (count) {
            refAction.current?.reload();
          }
        }}
      />

    </PageContainer>
    )
}