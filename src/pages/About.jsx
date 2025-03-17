import React from "react";

const About = () => {
  return (
    <div className="min-h-screen  pt-28 px-4 bg-[#eafde6]">
      <h1 className="text-4xl font-bold text-center mb-8">Nosotros</h1>
      <div className="max-w-4xl mx-auto mb-20">
        <div className="bg-white rounded-lg shadow-md p-8 text-justify">
          <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
          <p className="text-gray-700 mb-6 ">
            Somos una empresa especializada en el diseño y mantenimiento de
            jardines, con una amplia trayectoria transformando espacios
            exteriores en lugares únicos y especiales. Desde nuestros inicios,
            nos hemos dedicado a ofrecer soluciones innovadoras y sostenibles,
            siempre enfocados en satisfacer las necesidades de nuestros
            clientes.
            <br />
            <br />
            Nuestro recorrido nos ha permitido desarrollar una amplia gama de
            servicios, que incluyen la creación de jardines inteligentes,
            verticales, y en azoteas, así como la instalación de sistemas de
            riego automático y la construcción de terrazas y áreas verdes.
            Además, nos enorgullece ofrecer servicios de paisajismo,
            nebulización, y la creación de cascadas y lagos artificiales, entre
            otros.
            <br />
            <br />
            Con cada proyecto, buscamos no solo embellecer el entorno, sino
            también contribuir al bienestar y la calidad de vida de quienes
            disfrutan de nuestros espacios.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
          <p className="text-gray-700">
            Nuestra misión es crear espacios verdes que inspiren y mejoren la
            calidad de vida de nuestros clientes. Nos comprometemos a respetar
            el medio ambiente y a utilizar las mejores prácticas de jardinería
            en cada uno de nuestros proyectos.
            <br />
            <br />
            Buscamos ser líderes en la industria, ofreciendo servicios de alta
            calidad y soluciones personalizadas que reflejen la visión y los
            valores de cada cliente. A través de nuestro trabajo, aspiramos a
            fomentar un mundo más verde y sostenible, donde la naturaleza y el
            diseño se unan para crear experiencias únicas y memorables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
