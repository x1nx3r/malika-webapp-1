export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-6 my-4">
      {message}
    </div>
  );
}
