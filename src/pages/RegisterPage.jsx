import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/AuthContext"; 
import "../styles/Register.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

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
      await register(values.fullName, values.identification, values.email);
      resetForm();
      navigate("/login");
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


      <h1 className="fw-bold mb-4 text-center" 
        style={{ 
          color: "hsl(218, 81%, 75%)", 
          display: "inline-block", 
          paddingBottom: "5px"
        }}>
        REGISTER
      </h1>

      <MDBCard className="my-5 bg-glass" style={{ maxWidth: "400px", width: "100%" }}>
        <MDBCardBody className="custom-form">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
 
                <div className="mb-4">
                  <Field
                    as={MDBInput}
                    label="Nombre Completo"
                    id="fullName"
                    type="text"
                    name="fullName"
                    className="form-control"
                  />
                  <ErrorMessage name="fullName" component="div" className="text-danger" />
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
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

                <MDBBtn className="w-100 custom-button" size="md" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Registrarse"}
                </MDBBtn>
              </Form>
            )}
          </Formik>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>
</MDBContainer>
  );
};
export default RegisterPage;
