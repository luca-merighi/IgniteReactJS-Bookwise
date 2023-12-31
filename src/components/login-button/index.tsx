import Image from 'next/image'

interface LoginButtonProps {
    onClick: () => void,
    imageURL: string,
    text: string
}

export default function LoginButton({ onClick, imageURL, text }: LoginButtonProps) {
    return (
        <button
            onClick={onClick}
            type="button"
            className="
                px-6 py-5 w-[372px] bg-bk-gray-600
                text-lg text-bk-gray-200 font-bold
                flex gap-5 items-center
                border-2 border-transparent rounded-lg
                transition-colors hover:bg-bk-gray-500 focus:outline-none
                focus-visible:bg-bk-gray-500 focus-visible:border-bk-gray-200">
            <Image
                src={imageURL} alt=""
                width={32} height={32} />
            {text}
        </button>
    )
}