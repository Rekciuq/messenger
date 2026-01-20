import { imageRepository } from "../dll/ImageRepository";
import { userRepository } from "../dll/UserRepository";

type UserAdditionalInfo = {
    userId: string
    username?: string;
    bio?: string;
    profilePicture?: File;
}

export class UserProfileService {
    async updateProfileData({userId, profilePicture, username, ...rest}: UserAdditionalInfo) {
        if(profilePicture) {
            const imageId = (await imageRepository.findByUserId(userId)).id
            const newImageId = (await imageRepository.createImage({image: profilePicture})).imageId

            await imageRepository.deleteById(imageId, newImageId)

            await userRepository.update(userId, {...rest, userName: username, profilePicture: {connect: {id: newImageId}}})
        } else {
            await userRepository.update(userId, rest)
        }
    }
}

export const userProfileService = new UserProfileService();