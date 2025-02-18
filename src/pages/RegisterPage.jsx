import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext"; // Ajusta la ruta según tu estructura

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = UseAuth();

  const initialValues = {
    fullName: "",
    identification: "",
    email: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .required("El nombre es obligatorio"),
    identification: Yup.string()
      .matches(/^\d+$/, "Debe contener solo números")
      .min(4, "La identificación debe tener al menos 4 caracteres")
      .required("La identificación es obligatoria"),
    email: Yup.string()
      .email("Formato de correo inválido")
      .required("El correo es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await register(values.fullName,values.identification, values.email,);
      alert("Usuario registrado con éxito");
      resetForm();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Registro</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Field type="text" name="fullName" placeholder="Nombre completo" />
              <ErrorMessage name="fullName" component="div" style={{ color: "red" }} />
            </div>

            <div>
              <Field type="text" name="identification" placeholder="Identificación" />
              <ErrorMessage name="identification" component="div" style={{ color: "red" }} />
            </div>

            
            <div>
              <Field type="email" name="email" placeholder="Correo electrónico" />
              <ErrorMessage name="email" component="div" style={{ color: "red" }} />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;
