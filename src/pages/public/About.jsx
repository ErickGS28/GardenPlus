import React from "react";

const About = () => {
  return (
    <div className="min-h-screen pt-28 px-4 bg-gradient-to-b from-[#eafde6] to-[#e0f5d9]">
      <div className="max-w-6xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-primary relative inline-block">
            Nosotros
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-secondary"></div>
          </h1>
          <p className="text-xl text-primary/70 max-w-2xl mx-auto">
            Transformando espacios verdes en experiencias extraordinarias
          </p>
        </div>

        {/* Main content with decorative elements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left column - Our History */}
          <div className="h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 relative z-10 border border-primary/10 h-full flex flex-col">
              <h2 className="text-3xl font-semibold mb-6 text-primary flex items-center">
                <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clipRule="evenodd" />
                  </svg>
                </span>
                Nuestra Historia
              </h2>
              <div className="flex-grow">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Somos una empresa especializada en el diseño y mantenimiento de
                  jardines, con una amplia trayectoria transformando espacios
                  exteriores en lugares únicos y especiales. Desde nuestros inicios,
                  nos hemos dedicado a ofrecer soluciones innovadoras y sostenibles,
                  siempre enfocados en satisfacer las necesidades de nuestros
                  clientes.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Nuestro recorrido nos ha permitido desarrollar una amplia gama de
                  servicios, que incluyen la creación de jardines inteligentes,
                  verticales, y en azoteas, así como la instalación de sistemas de
                  riego automático y la construcción de terrazas y áreas verdes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Con cada proyecto, buscamos no solo embellecer el entorno, sino
                  también contribuir al bienestar y la calidad de vida de quienes
                  disfrutan de nuestros espacios.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Our Mission */}
          <div className="h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 relative z-10 border border-primary/10 h-full flex flex-col">
              <h2 className="text-3xl font-semibold mb-6 text-primary flex items-center">
                <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Nuestra Misión
              </h2>
              <div className="flex-grow">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Nuestra misión es crear espacios verdes que inspiren y mejoren la
                  calidad de vida de nuestros clientes. Nos comprometemos a respetar
                  el medio ambiente y a utilizar las mejores prácticas de jardinería
                  en cada uno de nuestros proyectos.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Buscamos ser líderes en la industria, ofreciendo servicios de alta
                  calidad y soluciones personalizadas que reflejen la visión y los
                  valores de cada cliente. A través de nuestro trabajo, aspiramos a
                  fomentar un mundo más verde y sostenible, donde la naturaleza y el
                  diseño se unan para crear experiencias únicas y memorables.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Sostenibilidad", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                description: "Comprometidos con prácticas ecológicas y respetuosas con el medio ambiente."
              },
              { 
                title: "Innovación", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                description: "Buscamos constantemente nuevas ideas y tecnologías para mejorar nuestros servicios."
              },
              { 
                title: "Excelencia", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                description: "Nos esforzamos por ofrecer la más alta calidad en cada proyecto que emprendemos."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-primary/5 flex flex-col items-center text-center"
              >
                <div className="text-primary mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-primary">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
