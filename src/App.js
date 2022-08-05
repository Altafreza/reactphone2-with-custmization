import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
  IconButton,
  makeStyles,
  MenuItem
} from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Form, Formik } from "formik";
import * as yep from "yup";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import moment from "moment";
import axios from "axios";
// import ApiConfig from "src/config/APICongig";
import { Link as RouterComponent } from "react-router-dom";
// import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import { toast } from "react-toastify";
import { values } from "lodash";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { KeyboardDatePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  buttonbox: {
    padding: "10px 18px"
  },
  date: {
    "& p": {
      marginLeft: "0px !important",
      fontSize: "12px !important"
    }
  },
  selectItems: {
    padding: "10px",
    background: "url(/images/background.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-reoeat",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.03)"
    }
  }
}));
function AddUser() {
  const classes = useStyles();

  const formValidationSchema = yep.object().shape({
    email: yep
      .string()
      .email("You have entered an invalid email address. Please try again")
      .required("Email address is required")
      .matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
    phoneNo: yep
      .string()
      .required("Mobile number is required")
      .matches(
        /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/,
        "Must be a valid mobilie"
      )
      .max(13, "Should not exceeds 13 digits")
      .min(10, "Must be only 10 digits"),
    password: yep
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      ),
    firstName: yep
      .string()
      .required("First name is required")
      .min(2, "Please enter atleast 2 characters")
      .max(35, "You can enter only 35 characters")
      .matches(
        /^([A-Z][a-z]+)$/,
        "First letter must be in capital letter, whitespaces are not allowed.  "
      ),

    lastName: yep
      .string()
      .required("Last Name is required")
      // .trim('The last name cannot include leading and trailing spaces')
      .min(2, "Please enter atleast 2 characters")
      .max(35, "You can enter only 35 characters")
      .matches(
        /^([A-Z][a-z]+)$/,
        "First letter must be in capital letter, whitespaces are not allowed.  "
      ),

    country: yep.string().required("Country is required")
  });
  const [countryCode, setCountryCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const history = useHistory();
  const [phone, setPhone] = useState();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [Countrylist, setCountrylist] = useState();
  const [showStates, setShowStates] = useState([]);
  const [_organizationid, setorganizationid] = useState(0);
  const [_organizationList, setOrganizationList] = useState([]);

  console.log("countrylist=====", Countrylist);

  const [btnText, setBtnText] = useState("CREATE AN ACCOUNT");
  const formInitialSchema = {
    email: "",
    firstName: "",
    lastName: "",
    phoneNo: phone,
    password: "",
    country: ""
  };
  // const handleFormSubmit = async (values) => {
  //   setIsLoading(true);
  //   setBtnText("Creating....");
  //   console.log("values-----", values);
  //   try {
  //     const res = await axios.post(ApiConfig.userSignUp, {
  //       email: values.email,
  //       password: values.password,
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       phoneNo: values?.phoneNo?.toString(),
  //       dateOfBirth: moment(values.dateOfBirth).unix()?.toString(),
  //       country: values.country,
  //     });

  //     if (res.data.status === 200) {
  //       setIsLoading(false);
  //       setBtnText("CREATE AN ACCOUNT");
  //       toast.success("Verify your otp");

  //       history.push("/verify-email-otp");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //     toast.error(error.message);
  //     setBtnText("CREATE AN ACCOUNT");
  //   }
  // };

  // useEffect(() => {
  //   axios.get("/static/json/countries.json").then(function (response) {
  //     setCountries(response.data.countries);
  //   });
  // }, []);

  // const _getOrganizationList = async () => {
  //   await axios.get(ApiConfig.listOrganization).then((res) => {
  //     setOrganizationList(res?.data?.result.rows);
  //   });
  // };
  // useEffect(() => {
  //   _getOrganizationList();
  // }, []);

  const changeCountryList = (name) => {
    const selectted = countries?.filter((cont) => {
      return cont.name === name;
    });
    const contId = selectted[0]?.id;

    const allState = states?.filter((state) => {
      return state.country_id === contId;
    });
    setShowStates(allState);
  };

  const changeCountry = (e) => {
    const name = e.target.value;
    changeCountryList(name);
  };
  return (
    <>
      {/* <Box style={{paddingTop:"20px"}}>
<Typography variant="h4">Add Banner</Typography>
</Box> */}

      <Grid className="d-flex  height100">
        <Box style={{ backgroundColor: "pink" }}>
          <Box className="signupbox" style={{ background: "transparent" }}>
            <Formik
              initialValues={formInitialSchema}
              initialStatus={{
                success: false,
                successMsg: ""
              }}
              validationSchema={formValidationSchema}
              // onSubmit={(values) => handleFormSubmit(values)}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
                setFieldValue
              }) => (
                <Form>
                  <Grid container direction={"column"}>
                    <Grid item>
                      <Typography variant="h5">Add User Details </Typography>
                    </Grid>

                    <Grid item style={{ marginBottom: "10px" }}>
                      <TextField
                        placeholder="Enter user first name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="firstName"
                        value={values.firstName}
                        error={Boolean(touched.firstName && errors.firstName)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <FormHelperText
                        error
                        style={{
                          margin: "0px",
                          fontSize: "12px",
                          paddingBottom: "0px !important"
                        }}
                      >
                        {touched.firstName && errors.firstName}
                      </FormHelperText>
                    </Grid>
                    <Grid item style={{ marginBottom: "10px" }}>
                      <TextField
                        placeholder="Enter user last name"
                        type="text"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="lastName"
                        value={values.lastName}
                        error={Boolean(touched.lastName && errors.lastName)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <FormHelperText
                        error
                        style={{ margin: "0px", fontSize: "12px" }}
                      >
                        {touched.lastName && errors.lastName}
                      </FormHelperText>
                    </Grid>
                    <Grid item style={{ marginBottom: "10px" }}>
                      <TextField
                        placeholder="Enter user email address"
                        type="text"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="email"
                        value={values.email}
                        error={Boolean(touched.email && errors.email)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <FormHelperText
                        error
                        style={{ margin: "0px", fontSize: "12px" }}
                      >
                        {touched.email && errors.email}
                      </FormHelperText>
                    </Grid>

                    <Grid item style={{ marginBottom: "10px" }}>
                      {errors.phoneNo === undefined && (
                        <>
                          <PhoneInput
                            country={"us"}
                            name="phoneNo"
                            inputStyle={{
                              marginTop: "52px !important",
                              width: "100%",
                              height: "52px"
                            }}
                            value={values.phoneNo}
                            error={Boolean(touched.phoneNo && errors.phoneNo)}
                            onBlur={handleBlur}
                            onChange={(phone, e) => {
                              setCountryCode(e.dialCode);
                              setFieldValue("phoneNo", phone);
                            }}
                          />
                        </>
                      )}

                      {errors.phoneNo === "Mobile number is required" && (
                        <PhoneInput
                          country={"us"}
                          name="phoneNo"
                          inputStyle={{
                            border: "1px solid red",

                            marginTop: "52px !important",
                            background: "transparent",
                            width: "100%",
                            color: "#fff",
                            height: "52px"
                          }}
                          value={values.phoneNo}
                          error={Boolean(touched.phoneNo && errors.phoneNo)}
                          onBlur={handleBlur}
                          onChange={(phone, e) => {
                            setCountryCode(e.dialCode);
                            setFieldValue("phoneNo", phone);
                          }}
                        />
                      )}
                      {errors.phoneNo?.matches ===
                        "/^(?:(?:+|0{0,2})91(s*|[-])?|[0]?)?([6789]d{2}([ -]?)d{3}([ -]?)d{4})$/" ||
                        (errors.phoneNo === "Must be a valid mobilie" && (
                          <PhoneInput
                            country={"us"}
                            name="phoneNo"
                            inputStyle={{
                              border: "1px solid red",

                              marginTop: "52px !important",
                              background: "transparent",
                              width: "100%",
                              color: "#fff",
                              height: "52px"
                            }}
                            value={values.phoneNo}
                            error={Boolean(touched.phoneNo && errors.phoneNo)}
                            onBlur={handleBlur}
                            onChange={(phone, e) => {
                              setCountryCode(e.dialCode);
                              setFieldValue("phoneNo", phone);
                            }}
                          />
                        ))}

                      <FormHelperText
                        error
                        style={{ margin: "0px", fontSize: "12px" }}
                      >
                        {touched.phoneNo && errors.phoneNo}
                      </FormHelperText>
                      {console.log("errors.phoneNosadhas", errors.phoneNo)}
                    </Grid>

                    <Grid item>
                      <FormControl fullWidth>
                        <Box style={{ width: "100%" }}>
                          <TextField
                            className={classes.inputvalue}
                            placeholder="Enter Your Password"
                            size="small"
                            variant="outlined"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            value={values.password}
                            name="password"
                            error={Boolean(touched.password && errors.password)}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    edge="end"
                                  >
                                    <Box className={classes.passsec}>
                                      {showPassword ? (
                                        <Visibility
                                          style={{
                                            color: "#fff",
                                            color: "#fff",
                                            fontSize: "12px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                          }}
                                        />
                                      ) : (
                                        <VisibilityOff
                                          style={{
                                            color: "#fff",
                                            color: "#fff",
                                            fontSize: "12px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                          <FormHelperText
                            error
                            style={{ margin: "0px", fontSize: "12px" }}
                          >
                            {touched.password && errors.password && (
                              <ul
                                style={{
                                  padding: "0px 0px 0px 19px",
                                  marginTop: "0px"
                                }}
                              >
                                <li>
                                  Must contain 8 characters, one uppercase, one
                                  lowercase, one number and one special case
                                  character
                                </li>
                              </ul>
                            )}
                          </FormHelperText>
                        </Box>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <FormControl
                        variant="outlined"
                        style={{ marginTop: "9px" }}
                        fullWidth
                      >
                        <InputLabel>Select Country</InputLabel>
                        <Select
                          // value={age}
                          // onChange={handleChange}
                          placeholder="Select Country"
                          label="Select Country"
                          name="country"
                          value={values.country}
                          error={Boolean(touched.country && errors.country)}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            changeCountry(e);
                          }}
                        >
                          <MenuItem>None</MenuItem>

                          {countries.map((countries) => {
                            return (
                              <MenuItem
                                className={classes.selectItems}
                                style={{}}
                                key={countries.name + countries.id}
                                value={countries.name}
                              >
                                {countries.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <FormHelperText error className={classes.date}>
                          {touched.country && errors.country}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <div className="relative w-full mb-3">
                        <Select
                          variant="outlined"
                          margin="dense"
                          defaultValue={_organizationid}
                          onChange={setorganizationid}
                          error={Boolean(touched.country && errors.country)}
                          onBlur={handleBlur}
                          fullWidth
                        >
                          <MenuItem value={0}>Select</MenuItem>
                          {_organizationList.map((data, index) => {
                            return (
                              <MenuItem
                                className={classes.selectItems}
                                key={index}
                                value={data.id}
                                style={{ padding: "10px" }}
                              >
                                {data.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <FormHelperText error>
                          {touched._organization && errors._organization}
                        </FormHelperText>
                      </div>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        style={{
                          background: "linear-gradient(#000, #362e9e)",
                          color: "#fff",
                          fontWeight: "600",
                          border: "1px solid #fff"
                        }}
                        disabled={isLoading}
                      >
                        Add User
                        {/* {isLoading && <ButtonCircularProgress />} */}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Grid>
    </>
  );
}

export default AddUser;
