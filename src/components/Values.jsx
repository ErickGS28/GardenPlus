import React from 'react';
import { Shield, Award, Clock, Leaf } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Seguridad",
    description: "Garantizamos la seguridad en cada proyecto, utilizando las mejores prácticas y materiales certificados."
  },
  {
    icon: Award,
    title: "Profesionalismo",
    description: "Nuestro equipo altamente capacitado asegura resultados excepcionales en cada servicio."
  },
  {
    icon: Clock,
    title: "Puntualidad",
    description: "Respetamos tu tiempo, cumpliendo con los plazos establecidos en cada proyecto."
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description: "Comprometidos con prácticas eco-amigables para cuidar el medio ambiente."
  }
];

const Values = () => {
  return (
    <section className="py-16 bg-emerald-50">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-emerald-900">Lo que ofrecemos</h2>
      </div>
  
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm 
                hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-3 bg-emerald-100 rounded-full mb-4 group-hover:bg-[#88c425] transition-all duration-500">
                  <IconComponent className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all duration-500 
                  group-hover:rotate-360" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2 group-hover:text-[#1b676b] transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
