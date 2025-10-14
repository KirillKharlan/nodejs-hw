
export interface IPost {
    id: number,
    name: String,
    description: String,
    img: String,
    likes: Number
}
export type createPostData = Omit<IPost,"id"> & {id?:number}
export type updatePostData = Partial<Omit<IPost,"id">>

export default IPost