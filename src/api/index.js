import request from "../utils/request";
//������֤��
export const getcode = (data) => {
    return request.post('/get/code', data)
}

//ע���û�
export const UserAuthentication = (data) => {
    return request.post('/user/authentication', data)
}

//��¼
export const login = (data) => {
    return request.post('/login', data)
}

//�˺Ź����б�
export const authAdmin = (param) => {
    const url = `/auth/admin?pageNum=${param.pageNum}&pageSize=${param.pageSize}`;
    return request.get(url);
}

//�˵�Ȩ���б�
export const getMenu = (param) => {
    return request.get('/user/getmenu', { param })
}

//�˵�Ȩ���޸�
export const setMenu = (data) => {
    return request.post('/user/setmenu', data)
}

//�˵��б�
export const menuList = (param) => {
    const url = `/menu/list?pageNum=${param.pageNum}&pageSize=${param.pageSize}`;
    return request.get(url);
}


//Ȩ�������б�
export const selectlist = (param) => {
    return request.get('/menu/selectlist', { param })
}


//�û������޸�
export const updateUser = (data) => {
    return request.post('/update/user', data)
}

//�û��˵�Ȩ��
export const permissionsc = () => {
    return request.get('/menu/permissions')
}

//�㻤ʦͷ���б�
export const getAvatar = () => {
    return request.get('/photo/list')
}

//�㻤ʦ����
export const createStaff = (data) => {
    return request.post('/companion', data)
}

//�㻤ʦ�б�
export const getStaffList = (param) => {
    return request.get('/companion/list', { params: { pageNum: param.pageNum, pageSize: param.pageSize } })
    // const url = `/companion/list?pageNum=${param.pageNum}&pageSize=${param.pageSize}`;
    // return request.get(url);
}
//�㻤ʦɾ��
export const delStaff = (data) => {
    return request.post('/delete/companion', data)
}
//��ҳ������Ϣ
export const getReport = () => {
    return request.get('/report')
}
// export const OrderList = (param) => {
//     const url = request.get(`/admin/order?pageNum=${param.pageNum}&pageSize=${param.pageSize}`)
//     return request.get(url);
// }
export const OrderList = (param) => {
    return request({
        url: `/admin/order?pageNum=${param.pageNum}&pageSize=${param.pageSize}`,
        method: 'get'
    });
}