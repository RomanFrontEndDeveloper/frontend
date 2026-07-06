type InputErrorProps = {
	message?: string;
};

export const InputError = ({ message }: InputErrorProps) => {
	if (!message) {
		return null;
	}

	return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};
