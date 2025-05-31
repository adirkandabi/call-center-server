import Tag from "../models/Tags";

export async function CreateTags(title: string) {
  const tag = await Tag.findOne({ title });
  if (tag) {
    return null;
  } else {
    const newTag = new Tag({ title });
    return await newTag.save();
  }
}

export async function GetTags() {
  return await Tag.find();
}

export async function UpdateTag(_id: string, title: string) {
  return await Tag.findByIdAndUpdate(_id, { title }, { new: true });
}
