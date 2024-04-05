import { convertPageData } from "@/utils/request";
import { openConfirm } from "@/utils/ui";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Link } from "@umijs/max";
import { Button, Select, Switch, message } from "antd"
import { orderBy, set } from "lodash";
import { useRef, useState } from "react";
import InputDialog from "../classTask/InputDialog";
import Check from "../classTask/Check";
import { deleteTasks, disableTask, enableTask, listTasks } from "@/services/api/classTask";
import { listClassId, listClassName } from "@/services/api/classes";

export const ids = await listClassId();
export const names = await listClassName();

export default () => {
    const refAction = useRef<ActionType>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, selectRow] = useState<string[]>([]);
    const [classTaskDTO, setClassTaskDTO] = useState<API.ClassTaskDTO>();
    const [searchProps, setSearchProps] = useState<API.ClassTaskQueryDTO>({});
    const [queryDTO, setQueryDTO] = useState<API.ClassTaskQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const [visibles, setVisibles] = useState(false);
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

    const columns: ProColumns<API.ClassTaskDTO>[] = [
        {
            title: '任务ID',
            dataIndex: 'taskId',
            width: 50,
        },
        {
            title: '班级ID',
            dataIndex: 'classId',
            width: 60,
            // search: false,
        },
        {
            title: '班级名称',
            dataIndex: 'className',
            width: 80,
            search: false,
          },
        {
            title: '任务描述',
            dataIndex: 'taskDescription',
            search: false,
        },
        {
            title: '任务状态',
            width: 100,
            search: false,
            render: (_, record) => [
              // <div>{record.taskState=="OFF" && <Button type="primary" size="small" danger ghost onClick={() => {
              //       enableTask(record);
              //       refAction.current?.reload();
              //       message.success('开启作业');}}
              //       >OFF</Button>}</div>,
              // <div>{record.taskState=="ON" && <Button type="primary" size="small" ghost onClick={() => {
              //       disableTask(record);
              //       refAction.current?.reload();
              //       message.error('关闭作业');}}
              //       >ON</Button>}</div>,
              <Switch 
                checkedChildren="ON" 
                unCheckedChildren="OFF" 
                onClick={() => {
                  if(record.taskState=="ON"){disableTask(record);}
                  else{enableTask(record);}
                }} 
                defaultChecked={record.taskState=="ON"} 
              />
          ],
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 150,
            search: false,
        },
        {
            title: '操作',
            width: 200,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Button type="link" onClick={() => {setClassTaskDTO(record);setVisible(true);}}>修改</Button>,
                <Button type="link" onClick={() => {setQueryDTO(record);setVisibles(true);}}>查看完成情况</Button>,
            ],
        },
    ]

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}个任务吗`, async () => {
          await deleteTasks(selectedRowKeys);
          refAction.current?.reload();
        });
      };

    return (
    <PageContainer>
        <ProTable<API.ClassTaskDTO>
            actionRef={refAction}
            rowKey="taskId"
            request={async (params = {}, sort) => {
                const props = {
                  ...params,
                  classId: classId,
                  className: className,
                  orderBy: orderBy(sort),
                };
                setSearchProps(props);
                return convertPageData(await listTasks(props));
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
                    setClassTaskDTO(undefined);
                    setVisible(true);
                  }}
                >
                  <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 发布任务
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
              ]}
              columns={columns}
              rowSelection={{
                onChange: (rowKeys) => {
                  selectRow(rowKeys as string[]);
                },
              }}
        />

        <InputDialog
        detailData={classTaskDTO}
        sub={false}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />

        <Check
        detailData={queryDTO}
        taskId={queryDTO.taskId!}
        onClose={(result) => {
          setVisibles(false);
          result && refAction.current?.reload();
        }}
        visible={visibles}
      />

      <Button type="link" disabled>●点击任务状态以开启/关闭任务</Button>

    </PageContainer>
    )
}