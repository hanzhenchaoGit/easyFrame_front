const props = {
  uploadUrl: {
    type: String,
    default: ''
  },
  fileListUrl: {
    type: String,
    default: ''
  },
  limitTypes: {
    type: String,
    default: ''
  },
  // 默认限制上传5M
  limitFileSize: {
    type: Number,
    default: 5
  },
  fileKey: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String
  },
  uploadType: {
    type: String,
    default() {
      return 'imgWall'
    }
    // 正常列表： list
    // 照片墙：imgWall
    // 头像：
  }
}
export default props
