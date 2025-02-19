import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { UseAuth } from "../context/AuthContext"; 
import "../styles/Register.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn
} from "mdb-react-ui-kit";


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
      navigate("/home");
    } catch {
      setSubmitting(false);
    }
  };

  return (
<MDBContainer 
  fluid 
  className="p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center"
  style={{ minHeight: "100vh" }}
>
  <MDBRow className="w-100">
    {/* Sección Izquierda */}
    <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
      <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: "hsl(218, 81%, 95%)" }}>
        Bienvenido de nuevo <br />
        <span style={{ color: "hsl(218, 81%, 75%)" }}>Accede a tu cuenta</span>
      </h1>
      <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
        Ingresa tus datos para continuar explorando el mundo de Marvel Comics.
      </p>
    </MDBCol>

    {/* Sección Derecha */}
    <MDBCol md="6" className="position-relative d-flex flex-column align-items-center">
      <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
      <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

      {/* Título LOG IN fuera del formulario */}
      <h1 className="fw-bold mb-4 text-center" 
        style={{ 
          color: " #ad1fff", 
          borderBottom: "px solid hsl(218, 81%, 75%)", 
          display: "inline-block", 
          paddingBottom: "5px"
        }}>
        LOG IN
      </h1>

      <MDBCard className="login-card bg-glass" style={{ maxWidth: "400px", width: "100%" }}>
        <MDBCardBody className="custom-form">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                {/* Campo Email */}
                <div className="mb-3">
                  <Field
                    as={MDBInput}
                    label="Correo Electrónico"
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                {/* Campo Identificación */}
                <div className="mb-3">
                  <Field
                    as={MDBInput}
                    label="Identificación"
                    id="identification"
                    type="text"
                    name="identification"
                    className="form-control"
                  />
                  <ErrorMessage name="identification" component="div" className="text-danger" />
                </div>

                {/* Botón de Inicio de Sesión */}
                <MDBBtn className="w-100 custom-button" size="md" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
                </MDBBtn>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-3">
            <p className="text-white">¿No tienes cuenta? <Link to="/register" className="text-light">Regístrate aquí</Link></p>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>
</MDBContainer>



  );
};


export default LoginPage;