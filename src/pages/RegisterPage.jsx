import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { UseAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBSpinner
} from "mdb-react-ui-kit";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = UseAuth();
  const { showToast } = useToast();

  const containerStyle = {
    minHeight: "100vh",
    height: "100vh",
    overflow: "hidden",
    position: "relative"
  };

  const cardStyle = {
    maxWidth: "400px",
    width: "100%",
    maxHeight: "500px",
    overflowY: "auto"
  };

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

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      await register(values.fullName, values.identification, values.email);
      showToast("¡Registro Exitoso!", "Usuario registrado correctamente");
      resetForm();
      navigate("/login"); // Navegación inmediata
    } catch (error) {
      setErrors, showToast("¡Error al registrar!", "El email debe ser unico, revisa tu información");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MDBContainer 
      fluid 
      className="p-4 background-radial-gradient overflow-hidden d-flex align-items-center justify-content-center"
      style={containerStyle}
    >
      <MDBRow className="w-100">
        <MDBCol md="6" className="text-center text-md-start d-flex flex-column justify-content-center">
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: "hsl(218, 81%, 95%)" }}>
            Bienvenido a MarvelComics <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>Conoce Sobre tus comics Favoritos</span>
          </h1>
          <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
            Regístrate para acceder a todos los comics que más te gustan.
          </p>
        </MDBCol>

        <MDBCol md="6" className="position-relative d-flex flex-column align-items-center">
          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <h1 
            className="fw-bold mb-4 text-center title-register"
            style={{ 
              color: "hsl(218, 81%, 75%)", 
              display: "inline-block", 
              paddingBottom: "5px"
            }}
          >
            REGISTRO
          </h1>

          <MDBCard className="my-5 bg-glass" style={cardStyle}>
            <MDBCardBody className="custom-form">
              <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema} 
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="needs-validation">
                    <div className="mb-4 login-register">
                      <Field
                        as={MDBInput}
                        label="Nombre Completo"
                        id="fullName"
                        type="text"
                        name="fullName"
                        className="form-control"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="fullName" component="div" className="text-danger small" />
                    </div>

                    <div className="mb-4 login-register">
                      <Field
                        as={MDBInput}
                        label="Identificación"
                        id="identification"
                        type="text"
                        name="identification"
                        className="form-control"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="identification" component="div" className="text-danger small" />
                    </div>

                    <div className="mb-4 login-register">
                      <Field
                        as={MDBInput}
                        label="Correo Electrónico"
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        disabled={isSubmitting}
                      />
                      <ErrorMessage name="email" component="div" className="text-danger small" />
                    </div>

                    {errors.submit && (
                      <div className="text-danger mb-3 small text-center">
                        {errors.submit}
                      </div>
                    )}

                    <MDBBtn 
                      className="w-100 custom-button position-relative" 
                      size="lg" 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <MDBSpinner size="sm" className="me-2" />
                          Registrando...
                        </>
                      ) : (
                        "Registrarse"
                      )}
                    </MDBBtn>
                  </Form>
                )}
              </Formik>
              <div className="text-center login-register-text mt-3">
                <p className="text-white">
                  ¿Ya tienes una cuenta? <Link to="/login" className="text-light">Login</Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default RegisterPage;