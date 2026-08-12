export default {
    blur: [
        { required: true, message: "此项为必填项", trigger: "blur" },
    ],
    change: [
        { required: true, message: "此项为必填项", trigger: "change" },
    ],
    phone: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { min: 11, max: 11, message: "手机号长度必须为 11 位", trigger: "blur" },
    ],
}
