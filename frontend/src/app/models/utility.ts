export interface CarouselItem {
    type: 'image' | 'product'
    imgUrl: string
    lowResImgUrl?: string
    url?: string
    name?: string
}

export interface ContactUsRequestBody {
    name: string
    email: string
    title: string
    message: string
    recaptchaToken: string
}

export interface VerificationMailRequestBody {
    username?: string
    email: string
    code?: string
}