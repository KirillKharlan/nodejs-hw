
export interface IUser {
    id: Number,
    name: String,
    email: String,
    password: Number,
}
export type createPostData = Omit<IUser,"id">
export type updatePostData = Omit<IUser,"id">

export default IUser