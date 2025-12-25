import { userRepository } from "../dll/UserRepository";
import { imageRepository } from "../dll/ImageRepository";
import bcrypt from "bcrypt";

export interface SignInInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    email: string;
    userName: string;
    bio?: string;
    password: string;
    profilePicture: File;
}

export class AuthService {
    async signIn(input: SignInInput) {
        const user = await userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        
        // Return user data without password
        return {
            id: user.id,
            email: user.email,
            userName: user.userName,
            bio: user.bio,
            profilePictureId: user.profilePictureId
        };
    }
    async signUp(input: SignUpInput) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(input.password, salt);

        const {imageId, imageUrl} = await imageRepository.createImage({
            image: input.profilePicture,
        });

        try {
        const user = await userRepository.createUser({
            email: input.email,
            userName: input.userName,
            bio: input.bio,
            password: hashedPassword,
            profilePictureId: imageId
        });

        return {
            id: user.id,
            email: user.email,
            userName: user.userName,
            bio: user.bio || undefined,
            profilePicture: imageUrl,
            profilePictureId: user.profilePictureId
        };
        } catch (error) {
            await imageRepository.deleteById(imageId);
            throw error;
        }
    }
}

export const authService = new AuthService();
