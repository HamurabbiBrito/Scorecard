export default function LoadingSpinner({ message }) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-blue-500"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  }