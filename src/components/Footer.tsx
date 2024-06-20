const Footer = () => {
  return (
    <footer className="p-4 mt-8 ">
      <div className="container text-right text-gray-500 pr-10">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
