import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { UseAuth } from "../context/AuthContext"; 

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = UseAuth();

  const initialValues = {
    email: "",
    identification: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Formato de correo inválido")
      .required("El correo es obligatorio"),
    identification: Yup.string()
      .matches(/^\d+$/, "Debe contener solo números")
      .min(4, "La identificación debe tener al menos 4 caracteres")
      .required("La identificación es obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.identification);
      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Correo electrónico"
              />
              <ErrorMessage
                name="email"
                component="div"
                style={{ color: "red" }}
              />
            </div>

            <div>
              <Field
                type="text"
                name="identification"
                placeholder="Identificación"
              />
              <ErrorMessage
                name="identification"
                component="div"
                style={{ color: "red" }}
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </Form>
        )}
      </Formik>
      <div>
        <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
