/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-03-18 16:47:12
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-03-20 12:57:05
 * @FilePath: \web-frontend-master\src\pages\student\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { convertPageData } from "@/utils/request";
import { openConfirm } from "@/utils/ui";
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined, RestFilled, UserOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Link, useModel } from "@umijs/max";
import { Button, Select } from "antd"
import { orderBy, set } from "lodash";
import { useRef, useState } from "react";
import { listSubmissions, clear, deleteSubmission, getSubmission } from "@/services/api/submission";
import { listClassId, listClassName } from "@/services/api/classes";
import { listTasks, listTasksForStudent } from "@/services/api/classTask";
import { getStudent } from "@/services/api/students";
import { getDepartment, listDepartment } from "@/services/api/department";
import InputDialog from "./InputDialog";
import Display from "../base/submission/Display";

export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [visible, setVisible] = useState(false);
    const [visibles, setVisibles] = useState(false);
    const { initialState, setInitialState } = useModel('@@initialState');
    const sid:string = initialState?.currentToken?.userCode !!!;
    const [studentsDTO, setStudentDTO] = useState<API.StudentsDTO>();
    const [classTask, setClassTask] = useState<API.ClassTaskDTO>();
    const [submission, setSubmission] = useState<API.SubmissionDTO>();

    const inital = async () => {
        if (sid == "root"){return;}
        const dto = await getStudent(parseInt(sid))!;
        setStudentDTO(dto);
        refAction.current?.reload();
    };

    const checkSub = async (taskId:string) => {
      const data: API.SubmissionDTO = {
        studentid : parseInt(initialState?.currentToken?.userCode!),
        taskId : taskId,
      }
      var sub:API.SubmissionDTO | undefined = await getSubmission(data);
      setSubmission(sub!)
    }
    
    const [once, setOnce] = useState(true);
    if (once){inital();setOnce(false)}

    const columns: ProColumns<API.ClassTaskVO>[] = [
        {
          title: '任务ID',
          dataIndex: 'taskId',
          width: 100,
        },
        {
          title: '任务描述',
          dataIndex: 'taskDescription',
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          width: 150,
          search:false,
        },
        {
            title: '操作',
            width: 180,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <div>
                  {sid!="root" && record.submitted && <Button type="link"><CheckOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />已提交</Button>}
                  {sid!="root" && record.submitted && <Button type="link" onClick={() => {checkSub(record.taskId!);setVisibles(true)}}>查看</Button>}
                  {sid!="root" && !record.submitted && record.taskState=="OFF" && <Button type="primary" danger disabled onClick={() => {setVisible(true);}}>未开启</Button>}
                  {sid!="root" && !record.submitted && record.taskState=="ON" && <Button type="primary" onClick={() => {setClassTask(record);setVisible(true);}}><EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />去提交</Button>}
                  {sid=="root" && <Button type="primary" disabled ghost>不可操作</Button>}
                </div>
            ],
        },
    ]

    return (
    <PageContainer>
        <ProTable<API.ClassTaskVO>
            actionRef={refAction}
            rowKey="id"
            search={false}
            request={async (params = {}, sort) => {
                const props = {
                  ...params,
                  studentId:parseInt(sid),
                  orderBy: orderBy(sort),
                };
                return convertPageData(await listTasksForStudent(props));
            }}
            toolBarRender={() => [
                <Button
                type="primary"
                key="primary"
                danger={sid=="root"}
              >
                <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />{initialState?.currentToken?.userCode}
              </Button>,
              <Button
              type="primary"
              key="primary"
              danger={sid=="root"}
              >
                {initialState?.currentToken?.userName}
              </Button>,
              <Button
              type="primary"
              key="primary"
              >
              {studentsDTO ? studentsDTO?.className : "无所属班级"}
              </Button>,
              ]}
              columns={columns}
        />

        <Display
        detailData={submission}
        onClose={(result) => {
          setVisibles(false);
          result && refAction.current?.reload();
        }}
        visible={visibles}
      />

        <InputDialog
        detailData={classTask}
        studentId={parseInt(sid)}
        studentName={initialState?.currentToken?.userName}
        onClose={(result) => {
          setVisible(false);
          result && refAction.current?.reload();
        }}
        visible={visible}
      />
      <div>●若作业未显示/更新，请及时刷新</div>

    </PageContainer>
    )
}