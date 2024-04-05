import { deleteClass, listClasses } from "@/services/api/classes";
import { convertPageData } from "@/utils/request";
import { openConfirm } from "@/utils/ui";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Link } from "@umijs/max";
import { Button, Dropdown, Space } from "antd"
import { orderBy, set } from "lodash";
import { useRef, useState } from "react";
import InputDialog from "../classes/InputDialog";
import InputDialogs from "../classTask/InputDialog";
import { DownOutlined } from '@ant-design/icons';
import ListStudents from "./ListStudents";
import type { MenuProps } from 'antd';

export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<string[]>([]);
    const [classes, setClasses] = useState<API.ClassesVO>();
    const [visible, setVisible] = useState(false);
    const [visibles, setVisibles] = useState(false);
    const [visibless, setVisibless] = useState(false);
    const [queryDTO, setQueryDTO] = useState<API.ClassesQueryDTO>();

    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <Button type="link" onClick={() => {setClasses(queryDTO);setVisibless(true);}}>查看学生</Button>
        ),
      },
      {
        key: '2',
        label: (
          <Button type="link" onClick={() => {setClasses(queryDTO);setVisibles(true);}}>发布任务</Button>
        ),
      },
    ]

    const columns: ProColumns<API.ClassesVO>[] = [
        {
            title: '班级ID',
            dataIndex: 'classId',
            width: 80,
            search: false,
        },
        {
            title: '班级名称',
            dataIndex: 'className',
            width: 100,
            search: false,
            render: (dom, record) => {
              return (
                <a
                  onClick={() => {
                    setClasses(record);
                    setVisible(true);
                  }}
                >
                  {dom}
                </a>
              );
            },
          },
        {
            title: '班级描述',
            dataIndex: 'description',
            search: false,
        },
        {
          title: '创建人',
          width: 80,
          dataIndex: 'createdBy',
          search: false,
      },
        {
            title: '人数',
            width: 50,
            dataIndex: 'sum',
            search: false,
            render: (dom, record) => {
              return (
                <a
                  onClick={() => {
                    setClasses(record);
                    setVisibless(true);
                  }}
                >
                  {dom}
                </a>
              );
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 150,
            search: false,
        },
        {
            title: '操作',
            width: 250,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Button type="link" onClick={() => {setClasses(record);setVisible(true);}}>修改</Button>,
                <Link to={`importStudent?classId=${record.classId}&className=${record.className}`}>导入学生</Link>,
                <Dropdown menu={{ items }} onOpenChange={() => {setQueryDTO(record)}}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      　更多
                      <DownOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Space>
                  </a>
                </Dropdown>,
              ],
        },
    ]

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}个班级吗`, async () => {
          await deleteClass(selectedRowKeys);
          refAction.current?.reload();
        });
      };

    return (
    <PageContainer>
        <ProTable<API.ClassesVO>
            actionRef={refAction}
            rowKey="classId"
            search={false}
            request={async (params = {}, sort) => {
                const props = {
                  ...params,
                  orderBy: orderBy(sort),
                };
                return convertPageData(await listClasses(props));
            }}
            toolBarRender={() => [
                <Button
                  type="primary"
                  key="primary"
                  onClick={() => {
                    setClasses(undefined);
                    setVisible(true);
                  }}
                >
                  <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 新建
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
        detailData={classes}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />

        <InputDialogs
          detailData={classes}
          sub={true}
          onClose={(result) => {
            setVisibles(false);
            result && refAction.current?.reload();
          } }
          visible={visibles}  />

        <ListStudents
          classId={classes?.classId!}
          className={classes?.className!}
          onClose={(result) => {
            setVisibless(false);
            result && refAction.current?.reload();
          } }
          visible={visibless}  />

    </PageContainer>
    )
}