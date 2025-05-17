export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mx-4 my-2 text-sm">
      {message}
    </div>
  );
}
