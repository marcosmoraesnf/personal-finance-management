import React, { useEffect, useState } from "react";
import {
  UserDefaultButton,
  AnalysisContainer,
  AnalysisTitleDiv,
  AuxDiv,
  ExpenseAnalysisDiv,
  ExpenseHistoryDiv,
  HistoryContainer,
  HistoryTitleDiv,
  ListFilterDiv,
  ListTitleDiv,
  NewCategoryDiv,
  NewCategoryFormDiv,
  DefaultTitle,
  NewCategoryTitleDiv,
  NewExpenseDiv,
  NewExpenseFormDiv,
  NewExpenseTitleDiv,
  UserExpensesContainer,
  UserExpensesDiv,
  UserItemsList,
  UserExpensesListContainer,
  LoadingDiv,
  UserCategoriesListContainer,
} from "./UserExpensesStyle";
import InputContainer from "../../components/UI/Input/Input";
import SelectContainer from "../../components/UI/Select/Select";
import axiosInstance from "../../axiosInstance";
import { BarLoader, FadeLoader } from "react-spinners";
import Expense from "../../components/ExpensesTracking/Expense/Expense";
import Modal from "../../components/UI/Modal/ConectionModal/Modal";
import Category from "../../components/ExpensesTracking/Categories/Category";
import PieChart from "../../components/UI/Charts/PieChart";
import { useDispatch, useSelector } from "react-redux";
import BarTableChart from "../../components/UI/Charts/BarTableChart/BarTableChart";
import {
  addExpenses,
  editACategory,
  fetchCategoriesData,
  fetchDynamicId,
  fetchExpensesData,
  postNewCategory,
  postNewExpense,
  removeACategory,
} from "../../features/expenses/expensesSlice";
import startFirebase from "../../services/firebaseConfig";
import Crud from "../../components/UI/Modal/CrudModal/Crud";
import { ref, set, get, update, remove, child, push } from "firebase/database";

const UserExpenses = () => {
  //Store
  const fetchedExpensesList = useSelector(
    (state) => state.expensesData.userExpenses
  );
  const postRequestStatus = useSelector(
    (state) => state.expensesData.postRequest
  );
  const dispatch = useDispatch();

  //Firebase
  const db = startFirebase();

  /*const create = () => {
    set(ref(db, "category"), { test: "teste validado" });
  };*/

  //States
  const [userExpense, setUserExpense] = useState({
    id: "expense",
    inputName: {
      value: "",
      isValid: false,
      isTouched: false,
      id: "Expense Name",
      placeholder: "Expense Name",
      invalidMessage: "",
    },
    inputValue: {
      value: "",
      isValid: false,
      isTouched: false,
      id: "Expense Value",
      placeholder: "Ex 150,00",
      invalidMessage: "",
    },
    inputCategory: {
      value: "",
      categoryId: "",
      categoryIsValid: false,
      categoryIsTouched: false,
      id: "Expense Category",
    },
    inputNewCategory: {
      value: "",
      isValid: false,
      isTouched: false,
      id: "New Expense Category",
      placeholder: "New Expense Category",
      invalidMessage: "",
    },
    inputDate: {
      value: "",
      isValid: false,
      isTouched: false,
      id: "Expense Date",
      invalidMessage: "",
    },
    inputSpend: {
      id: "New Category Spending Limit",
      value: "",
      isValid: false,
      isTouched: false,
      placeholder: "Ex: 1800,00",
      invalidMessage: "",
    },
  });

  const [userCategory, setUserCategory] = useState({
    // id: "category",

    inputNewCategory: {
      id: "Category Name",
      value: "",
      isValid: false,
      isTouched: false,
      placeholder: "Category Name",
      invalidMessage: "",
    },
    inputSpend: {
      id: "Category Spending Limit",
      value: "",
      isValid: false,
      isTouched: false,
      placeholder: "Ex: 1800,00",
      invalidMessage: "",
    },
  });

  const [editCategory, setEditCategory] = useState({
    inputNewCategoryName: {
      id: "Edit Category Name",
      value: "",
      isValid: false,
      isTouched: false,
      invalidMessage: "",
      placeholder: "New Category Name",
    },
    inputSpend: {
      id: "Edit Spending Limit",
      value: "",
      isValid: false,
      isTouched: false,
      invalidMessage: "",
      placeholder: "Ex: 2000,00",
    },
  });

  const [modalInformation, setModalInformation] = useState({
    statusName: "",
    message: "",
    newExpenseName: "",
    newExpenseValue: "",
    newExpenseDate: "",
    newCategoryName: "",
    newCategorySpendLimit: "",
  });
  const [crudType, setCrudType] = useState({
    crudType: "",
    categoryName: "",
    categorySpendLimit: "",
    categoryId: "",
    expenseName: "",
    expenseValue: "",
    expenseDate: "",
    expenseId: "",
  });

  const [showEditCategories, setShowEditCategories] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("sort by name");
  const [loading, setLoading] = useState(false);
  const [loadingOnSubmitExpense, setLoadingOnSubmitExpense] = useState(false);
  const [loadingOnSubmitCategory, setLoadingOnSubmitCategory] = useState(false);
  //const [fetchedExpensesList, setFetchedExpensesList] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showCrud, setShowCrud] = useState(false);
  const [infoBtnList, setInfoBtnList] = useState(null);
  const [categoryKeysList, setCategoryKeysList] = useState(null);
  const [expenseSubmitPermission, setExpenseSubmitPermission] = useState(false);
  const [categorySubmitPermission, setCategorySubmitPermission] =
    useState(false);
  const [editCategorySubmit, setEditCategorySubmit] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([
    { id: "new-category", name: "New Category" },
  ]);
  const [totalSpendLimit, setTotalSpendLimit] = useState(0);

  //Selectors

  const sliceValues = useSelector((state) => state.initialSlices);

  //Support Arrays

  const expenseItems = [];
  const buttons = [];

  //Effects

  //test

  useEffect(() => {}, [infoBtnList]);
  useEffect(() => {}, [categoryOptions]);
  useEffect(() => {
    ///create();
    dispatch(removeACategory("olá"));
    getExpenses();
  }, []);

  //Functions
  const expandBtnHandler = (expenseId) => {
    let currentValue = infoBtnList.buttons[expenseId].isOpen;

    setInfoBtnList({
      buttons: {
        ...infoBtnList.buttons,
        [expenseId]: { isOpen: !currentValue },
      },
    });
  };

  const BackdropModalHandler = () => {
    setShowModal(false);
  };

  const BackdropCrudHandler = () => {
    setShowCrud(false);
    setEditCategory({
      ...editCategory,
      inputNewCategoryName: {
        ...editCategory.inputNewCategoryName,
        isTouched: false,
        isValid: false,
        value: "",
      },
      inputSpend: {
        ...editCategory.inputSpend,
        isTouched: false,
        isValid: false,
        value: "",
      },
    });
  };

  const categoryAlreadyExists = (expenseCategoryName, categoryId) => {
    // console.log("aqui", categoryOptions);
    let exists = categoryOptions.find(
      (option) =>
        option.name === expenseCategoryName && option.id !== categoryId
    );

    return exists;
  };

  const checkInputValidation = (expenseId, value, categoryId) => {
    const isValidName = (expenseName) =>
      /^[a-zA-ZzáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,15}(?: [a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{1,15})?$/.test(
        expenseName
      );

    const isValidValue = (expenseValue) =>
      /^[0-9]+\,[0-9]{2,2}$/i.test(expenseValue);

    const isValidDate = (expenseDate) =>
      /^([0-9]{4})\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(
        expenseDate
      );
    //console.log(value);
    const validation1 = isValidName(value);
    const validation2 = isValidValue(value);
    const validation3 = value !== "" && value !== "New Category";
    const validation4 = categoryAlreadyExists(value, categoryId);
    const validation5 = isValidDate(value);

    let result = false;

    switch (expenseId) {
      case "Expense Name":
        validation1 ? (result = true) : (result = false);
        break;
      case "Expense Value":
        validation2 ? (result = true) : (result = false);
        break;
      case "Expense Category":
        validation3 ? (result = true) : (result = false);
        break;
      case "New Expense Category":
        validation1
          ? !validation4
            ? (result = true)
            : (result = false)
          : (result = false);
        break;
      case "Expense Date":
        //   console.log(value);
        validation5 ? (result = true) : (result = false);
        break;
      case "Category Name":
        validation1
          ? !validation4
            ? (result = true)
            : (result = false)
          : (result = false);

        break;
      case "Category Spending Limit":
        validation2 ? (result = true) : (result = false);
        break;
      case "New Category Spending Limit":
        validation2 ? (result = true) : (result = false);
        break;
      case "Edit Category Name":
        validation1
          ? !validation4
            ? (result = true)
            : (result = false)
          : (result = false);
        break;
      case "Edit Spending Limit":
        validation2 ? (result = true) : (result = false);
        break;
      default:
        break;
    }

    return result;
  };

  const verifyFocus = (expenseId, elementIsValid, categoryId) => {
    let exists = false;
    let message = "";
    if (!elementIsValid) {
      switch (expenseId) {
        case "Expense Name":
          setUserExpense({
            ...userExpense,
            inputName: {
              ...userExpense.inputName,
              invalidMessage:
                userExpense.inputName.value === "" ? "" : "Invalid name!",
            },
          });
          break;
        case "Expense Value":
          setUserExpense({
            ...userExpense,
            inputValue: {
              ...userExpense.inputValue,
              invalidMessage:
                userExpense.inputValue.value === "" ? "" : "Invalid value!",
            },
          });
          break;
        case "Category Spending Limit":
          setUserCategory({
            ...userCategory,
            inputSpend: {
              ...userCategory.inputSpend,
              invalidMessage:
                userCategory.inputSpend.value === "" ? "" : "Invalid value!",
            },
          });
          break;
        case "New Category Spending Limit":
          setUserExpense({
            ...userExpense,
            inputSpend: {
              ...userExpense.inputSpend,
              invalidMessage:
                userExpense.inputSpend.value === "" ? "" : "Invalid value!",
            },
          });
          break;
        case "New Expense Category":
          exists = categoryAlreadyExists(userExpense.inputNewCategory.value);
          message = "";
          exists
            ? (message = "Category Already exists!")
            : (message = "Invalid name!");
          setUserExpense({
            ...userExpense,
            inputNewCategory: {
              ...userExpense.inputNewCategory,
              invalidMessage:
                userExpense.inputNewCategory.value === "" ? "" : message,
            },
          });
          break;
        case "Expense Date":
          setUserExpense({
            ...userExpense,
            inputDate: {
              ...userExpense.inputDate,
              invalidMessage: "Invalid date!",
            },
          });
          break;
        case "Category Name":
          exists = categoryAlreadyExists(userCategory.inputNewCategory.value);
          message = "";
          exists
            ? (message = "Category Already exists!")
            : (message = "Invalid name!");
          setUserCategory({
            ...userCategory,
            inputNewCategory: {
              ...userCategory.inputNewCategory,
              invalidMessage:
                userCategory.inputNewCategory.value === "" ? "" : message,
            },
          });

          break;
        case "Edit Category Name":
          exists = categoryAlreadyExists(
            editCategory.inputNewCategoryName.value,
            categoryId
          );
          message = "";
          exists
            ? (message = "Category Already exists!")
            : (message = "Invalid name!");
          setEditCategory({
            ...editCategory,
            inputNewCategoryName: {
              ...editCategory.inputNewCategoryName,
              invalidMessage:
                editCategory.inputNewCategoryName.value === "" ? "" : message,
            },
          });
          break;
        case "Edit Spending Limit":
          setEditCategory({
            ...editCategory,
            inputSpend: {
              ...editCategory.inputSpend,
              invalidMessage:
                editCategory.inputSpend.value === "" ? "" : "Invalid value!",
            },
          });
          break;
        default:
          break;
      }
      return true;
    } else {
      switch (expenseId) {
        case "Expense Name":
          setUserExpense({
            ...userExpense,
            inputName: {
              ...userExpense.inputName,
              invalidMessage: "",
            },
          });
          break;
        case "Expense Value":
          setUserExpense({
            ...userExpense,
            inputValue: {
              ...userExpense.inputValue,
              invalidMessage: "",
            },
          });
          break;
        case "New Expense Category":
          setUserExpense({
            ...userExpense,
            inputNewCategory: {
              ...userExpense.inputNewCategory,
              invalidMessage: "",
            },
          });
          break;
        case "Expense Date":
          setUserExpense({
            ...userExpense,
            inputDate: {
              ...userExpense.inputDate,
              invalidMessage: "",
            },
          });
          break;
        case "Category Name":
          setUserCategory({
            ...userCategory,
            inputNewCategory: {
              ...userCategory.inputNewCategory,
              invalidMessage: "",
            },
          });
          break;
        case "Category Spending Limit":
          setUserCategory({
            ...userCategory,
            inputSpend: {
              ...userCategory.inputSpend,
              invalidMessage: "",
            },
          });
          break;
        case "New Category Spending Limit":
          setUserExpense({
            ...userExpense,
            inputSpend: {
              ...userExpense.inputSpend,
              invalidMessage: "",
            },
          });
          break;
        case "Edit Spending Limit":
          setEditCategory({
            ...editCategory,
            inputSpend: {
              ...editCategory.inputSpend,
              invalidMessage: "",
            },
          });
          break;
        case "Edit Category Name":
          setEditCategory({
            ...editCategory,
            inputNewCategoryName: {
              ...editCategory.inputNewCategoryName,
              invalidMessage: "",
            },
          });
          break;
        default:
          break;
      }

      return false;
    }
  };

  const InputChangeHandler = (event, expenseId, categoryId) => {
    switch (expenseId) {
      case "Category Name":
        setUserCategory({
          ...userCategory,
          inputNewCategory: {
            ...userCategory.inputNewCategory,

            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        checkCategoryButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "Category Spending Limit":
        setUserCategory({
          ...userCategory,
          inputSpend: {
            ...userCategory.inputSpend,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        checkCategoryButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "New Category Spending Limit":
        setUserExpense({
          ...userExpense,
          inputSpend: {
            ...userExpense.inputSpend,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        // checkCategoryButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "Expense Name":
        setUserExpense({
          ...userExpense,
          inputName: {
            ...userExpense.inputName,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
          /*expenseName: event.currentTarget.value,
          nameIsTouched: true,
          nameIsValid: checkInputValidation(
            expenseId,
            event.currentTarget.value
          ),*/
        });
        checkExpenseButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "Expense Value":
        setUserExpense({
          ...userExpense,
          inputValue: {
            ...userExpense.inputValue,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        checkExpenseButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "Expense Date":
        setUserExpense({
          ...userExpense,
          inputDate: {
            ...userExpense.inputDate,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        checkExpenseButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "Expense Category":
        setUserExpense({
          ...userExpense,
          inputCategory: {
            ...userExpense.inputCategory,
            categoryId: findCategoryId(event.currentTarget.value),
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        //console.log("cat", userExpense.inputCategory);
        checkExpenseButtonValidation(expenseId, event.currentTarget.value);

        break;
      case "New Expense Category":
        setUserExpense({
          ...userExpense,
          inputNewCategory: {
            ...userExpense.inputNewCategory,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        checkExpenseButtonValidation(expenseId, event.currentTarget.value);
        break;
      case "Edit Category Name":
        setEditCategory({
          ...editCategory,
          inputNewCategoryName: {
            ...editCategory.inputNewCategoryName,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(
              expenseId,
              event.currentTarget.value,
              categoryId
            ),
          },
        });
        checkEditCategoryBtnValidation(expenseId, event.currentTarget.value);
        break;
      case "Edit Spending Limit":
        setEditCategory({
          ...editCategory,
          inputSpend: {
            ...editCategory.inputSpend,
            value: event.currentTarget.value,
            isTouched: true,
            isValid: checkInputValidation(expenseId, event.currentTarget.value),
          },
        });
        checkEditCategoryBtnValidation(expenseId, event.currentTarget.value);
        break;
      default:
        break;
    }
  };

  const FilterInputChangeHandler = (event) => {
    setFilterValue(event.currentTarget.value);
  };

  const FilterChangeHandler = (event) => {
    setFilterType(event.currentTarget.value);
  };

  const verifySelectType = () => {
    let filteredList = [];
    //console.log(sliceValues);
    if (!showEditCategories) {
      switch (filterType) {
        case "sort by name":
          filteredList = fullList.filter((expense) => {
            if (expense?.props.expenseTopic.includes(filterValue)) {
              return expense;
            }
            return null;
          });
          break;
        case "sort by value":
          filteredList = fullList.filter((expense) => {
            if (Number(expense?.props.expenseTotal) >= Number(filterValue)) {
              return expense;
            }
            return null;
          });
          break;
        default:
          break;
      }
      return filteredList;
    } else {
      switch (filterType) {
        case "sort by name":
          filteredList = categoryList.filter((item) => {
            if (item?.props.categoryName.includes(filterValue)) {
              return item;
            }
            return null;
          });
          break;
        case "sort by value":
          filteredList = categoryList.filter((item) => {
            if (Number(item.props.spendLimit) >= Number(filterValue)) {
              return item;
            }
            return null;
          });
          break;
        default:
          break;
      }
      return filteredList;
    }
  };

  const checkExpenseButtonValidation = (expenseId, value) => {
    //falta adicionar o disable
    let validation1 = userExpense.inputName.isValid === true;
    let validation2 = userExpense.inputValue.isValid === true;
    let validation3 = userExpense.inputCategory.isValid === true;
    let validation4 = userExpense.inputNewCategory.isValid === true;
    let validation5 = userExpense.inputDate.isValid === true;
    let validation6 = userExpense.inputSpend.isValid === true;

    switch (expenseId) {
      case "Expense Name":
        validation1 = checkInputValidation(expenseId, value);
        break;
      case "Expense Value":
        validation1 = checkInputValidation(expenseId, value);
        break;
      case "Expense Category":
        validation3 = checkInputValidation(expenseId, value);
        break;
      case "New Expense Category":
        validation4 = checkInputValidation(expenseId, value);
        break;
      case "Expense Date":
        validation5 = checkInputValidation(expenseId, value);
        break;
      case "New Category Spending Limit":
        validation6 = checkInputValidation(expenseId, value);
        break;
      default:
        break;
    }
    if (validation1 && validation2 && validation3 && validation5) {
      setExpenseSubmitPermission(true);
    } else {
      if (
        validation1 &&
        validation2 &&
        validation4 &&
        validation5 &&
        validation6
      ) {
        setExpenseSubmitPermission(true);
      } else {
        setExpenseSubmitPermission(false);
      }
    }
  };
  const checkCategoryButtonValidation = (expenseId, value) => {
    let validation1 = userCategory.inputNewCategory.isValid === true;
    let validation2 = userCategory.inputSpend.isValid === true;

    switch (expenseId) {
      case "Category Name":
        validation1 = checkInputValidation(expenseId, value);
        break;
      case "Category Spending Limit":
        validation2 = checkInputValidation(expenseId, value);
        break;
      default:
        break;
    }

    if (validation1 && validation2) {
      setCategorySubmitPermission(true);
    } else {
      setCategorySubmitPermission(false);
    }
  };

  const checkEditCategoryBtnValidation = (expenseId, value) => {
    let validation1 = editCategory.inputNewCategoryName.isValid === true;
    let validation2 = editCategory.inputSpend.isValid === true;

    switch (expenseId) {
      case "Edit Category Name":
        validation1 = checkInputValidation(expenseId, value);
        break;
      case "Edit Spending Limit":
        validation2 = checkInputValidation(expenseId, value);
        break;
      default:
        break;
    }

    if (validation1 && validation2) {
      setEditCategorySubmit(true);
    } else {
      setEditCategorySubmit(false);
    }
  };

  const submitCategory = async () => {
    setLoadingOnSubmitCategory(true);

    await dispatch(postNewCategory(userCategory, { pudim: "oi" }))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setCategoryOptions([
            ...categoryOptions,
            { name: userCategory.inputNewCategory.value },
          ]);

          setUserCategory({
            ...userCategory,
            inputNewCategory: {
              ...userCategory.inputNewCategory,
              isTouched: false,
              isValid: "false",
              value: "",
            },
            inputSpend: {
              ...userCategory.inputSpend,
              isTouched: false,
              isValid: "false",
              value: "",
            },
          });
          getExpenses();
        }
      })
      .catch((err) => {
        setShowModal(true);
        setModalInformation({
          ...modalInformation,
          statusName: err.name,
          message: err.message,
        });
      });
    setLoadingOnSubmitCategory(false);
    //será trocado pelo firebase

    //setLoadingOnSubmitCategory(false);

    setCategorySubmitPermission(false);
  };

  const submitExpense = async (event, categoryValue) => {
    event.preventDefault();
    setLoadingOnSubmitExpense(true);
    setInfoBtnList(null);

    //utilizando post do firebase

    //APENAS TESTE DE REQUEST
    if (userExpense.inputCategory.value === "New Category") {
      await dispatch(postNewCategory(userExpense))
        .then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            setCategoryOptions([...categoryOptions, { name: categoryValue }]);
          }
        })
        .catch((err) => {
          setShowModal(true);

          setModalInformation({
            ...modalInformation,
            statusName: err.name,
            message: err.message,
          });
        });
    }
    //VOLTAR AQUI
    await dispatch(postNewExpense(userExpense))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setLoadingOnSubmitExpense(false);
          getExpenses();
          setUserExpense({
            ...userExpense,
            inputName: {
              ...userExpense.inputName,
              isTouched: false,
              isValid: "false",
              value: "",
            },

            inputDate: {
              ...userExpense.inputDate,
              isTouched: false,
              isValid: "false",
              value: "",
            },
            inputSpend: {
              ...userExpense.inputSpend,
              isTouched: false,
              isValid: "false",
              value: "",
            },
            inputValue: {
              ...userExpense.inputValue,
              isTouched: false,
              isValid: "false",
              value: "",
            },
            inputNewCategory: {
              ...userExpense.inputNewCategory,
              isTouched: false,
              isValid: "false",
              value: "",
            },
            inputCategory: {
              ...userExpense.inputCategory,
              isTouched: false,
              isValid: false,
              value: "",
            },
          });
        }
      })
      .catch((err) => {
        setShowModal(true);
        setModalInformation({
          ...modalInformation,
          statusName: err.name,
          message: err.message,
        });
      });

    setExpenseSubmitPermission(false);
    // console.log(userExpense);
  };

  const changeCategoryDivHandler = () => {
    setShowEditCategories(!showEditCategories);
  };

  let newCategory = null;

  if (
    userExpense.inputCategory.isTouched &&
    userExpense.inputCategory.value === "New Category"
  ) {
    newCategory = (
      <>
        <InputContainer
          placeholder={userExpense.inputNewCategory.placeholder}
          changed={(event) =>
            InputChangeHandler(event, userExpense.inputNewCategory.id)
          }
          invalidMessage={
            userExpense.inputNewCategory.isValid
              ? ""
              : userExpense.inputNewCategory.invalidMessage
          }
          blur={() =>
            verifyFocus(
              userExpense.inputNewCategory.id,
              userExpense.inputNewCategory.isValid
            )
          }
          value={userExpense.inputNewCategory.value}
          width={"200px"}
        >
          New Category Name
        </InputContainer>
        <InputContainer
          placeholder={userExpense.inputSpend.placeholder}
          changed={(event) =>
            InputChangeHandler(event, userExpense.inputSpend.id)
          }
          invalidMessage={
            userExpense.inputSpend.isValid
              ? ""
              : userExpense.inputSpend.invalidMessage
          }
          blur={() =>
            verifyFocus(
              userExpense.inputSpend.id,
              userExpense.inputSpend.isValid
            )
          }
          value={userExpense.inputSpend.value}
          width={"200px"}
        >
          Category Spending Limit
        </InputContainer>
      </>
    );
  }
  //MUDAR O IF RES !== NULL
  const getExpenses = async () => {
    let uniqueCategories = [];
    setLoading(true);
    dispatch(fetchDynamicId());

    await dispatch(fetchCategoriesData())
      .unwrap()
      .then((res) => {
        //console.log("AQUI", res);
        if (res !== null) {
          let fetchedCategories = Object.values(res);

          let categoryArray = [];
          let SpendLimitArray = [];

          fetchedCategories.forEach((categoryObj) => {
            categoryArray.push({
              id: categoryObj.id,
              name: categoryObj.category,
            });
            SpendLimitArray.push({ value: categoryObj.spendLimit });

            let categoryExists = fetchedCategories.some(
              (cat) => cat.category === categoryObj.category
            );

            if (categoryExists) {
              expenseItems.push({
                category: categoryObj.category,
                id: categoryObj.id,
                spendLimit: categoryObj.spendLimit,
                expensesList: [],
              });
            }
            // console.log("aq", expenseItems);
          });

          setTotalSpendLimit(calculateExpenses(SpendLimitArray));

          let newCategoryArray = categoryOptions.concat(categoryArray);

          let transformedArrayName = newCategoryArray.map((arr) => arr.name);
          //console.log("trans", transformedArrayName);
          let uniqueNames = [...new Set(transformedArrayName)];
          let transformedArrayId = newCategoryArray.map((arr) => arr.id);
          //console.log("ids", transformedArrayId);
          let uniqueIds = [...new Set(transformedArrayId)];

          uniqueNames.forEach((value) => {
            uniqueCategories.push({ name: value });
          });
          let organizedCategories = uniqueCategories.map(
            (category, index) =>
              (category = { name: category.name, id: uniqueIds[index] })
          );

          setCategoryKeysList(organizedCategories);
          setCategoryOptions(organizedCategories);
        }
      })
      .catch((err) => {
        setShowModal(true);
        setModalInformation({
          ...modalInformation,
          statusName: err.name,
          message: err.message,
        });
      });
    //console.log("category finalizada");
    await dispatch(fetchExpensesData())
      .unwrap()
      .then((res) => {
        //console.log("expenses");
        if (res !== null) {
          let fetchedExpenses = Object.values(res);

          fetchedExpenses.forEach((expense) => {
            let categoryIndex = expenseItems.findIndex(
              (item) => expense.categoryId === item.id
            );

            expenseItems[categoryIndex]?.expensesList.push({
              name: expense.name,
              value: expense.value,
              date: expense.date,
              percentage: (
                (convertToNumber(expense.value) /
                  convertToNumber(expenseItems[categoryIndex].spendLimit)) *
                100
              ).toFixed(2),
            });
          });

          expenseItems
            .filter((expense) => expense.expensesList.length > 0)
            .forEach((expense) => {
              // console.log("novo", expense);
              buttons.push({ isOpen: false });
            });

          let filteredBtns = buttons.slice(0, uniqueCategories.length - 1);

          setInfoBtnList({ buttons: filteredBtns });

          dispatch(addExpenses(expenseItems));
          //console.log("a ser filtrado", expenseItems);
          const categoryWithExpenses = expenseItems.filter((item) => {
            if (item.expensesList.length > 0) {
              return item;
            }
          });
          //console.log(categoryWithExpenses);
          setFilteredCategories(categoryWithExpenses);
          //console.log(expenseItems);
          setLoading(false);
          //console.log("user", userExpense);
        }
      })
      .catch((err) => {
        setShowModal(true);

        setModalInformation({
          ...modalInformation,
          statusName: err.name,
          message: err.message,
        });
      });
  };

  const findCategoryId = (value) => {
    let category;
    if (categoryKeysList !== null) {
      category = categoryKeysList.find((category) => {
        if (category.name === value) {
          return category;
        }
      });
      // console.log("a", category);
      return category !== undefined ? category.id : "default";
    }
    return;
    //console.log("AQ", categoryId.id);
  };

  const calculateExpenses = (list) => {
    let valuesList = [];
    list.forEach((item) => {
      valuesList.push(convertToNumber(item.value));
    });

    let totalValue = valuesList.reduce(
      (acc, currentValue) => acc + Number(currentValue),
      0
    );

    return totalValue.toFixed(2);
  };

  const convertToNumber = (stringValue) => {
    let initialValue = [...stringValue];
    let commaIndex = initialValue.findIndex((element) => element === ",");
    initialValue.splice(commaIndex, 1, ".");
    let replacedValue = initialValue.join("");
    let convertedValue = Number(replacedValue).toFixed(2);

    return convertedValue;
  };

  const calculateExpectedPercentage = (categoryLimit) => {
    let expectedPercentage = convertToNumber(categoryLimit) / totalSpendLimit;
    return (expectedPercentage * 100).toFixed(2);
  };

  const calculateRealPercentage = (list) => {
    let allCategoryExpenses = calculateExpenses(list);
    let realPercentage = allCategoryExpenses / totalSpendLimit;
    return realPercentage.toFixed(2) * 100;
  };

  let fullList = null;

  if (fetchedExpensesList !== null && infoBtnList !== null) {
    let btnIndex = 0;
    fullList = fetchedExpensesList.map((expense, index) => {
      if (expense.expensesList.length > 0) {
        //console.log("btn length", btnIndex, index);
        let currentBtnIndex = btnIndex;
        btnIndex += 1;

        //let btnIndex = infoBtnList.buttons.length;
        return (
          <Expense
            expensesPage
            key={index}
            expenseTopic={expense.category}
            expenseTotal={calculateExpenses(expense.expensesList)}
            expenseDataList={expense.expensesList}
            realPercentage={calculateRealPercentage(
              expense.expensesList
            ).toFixed(2)}
            percentageExpected={calculateExpectedPercentage(expense.spendLimit)}
            clicked={() => {
              expandBtnHandler(currentBtnIndex);
            }}
            details={
              infoBtnList !== null
                ? infoBtnList.buttons[currentBtnIndex].isOpen === true
                  ? "Less Info"
                  : "More Info"
                : null
            }
          />
        );
      }
      return null;
    });
  }

  let categoryList = null;

  const editCategoryHandler = (
    categoryName,
    categorySpendLimit,
    categoryId
  ) => {
    let name = categoryName;
    let limit = categorySpendLimit;
    let id = categoryId;
    setCrudType({
      ...crudType,
      crudType: "edit-category",
      categoryName: name,
      categorySpendLimit: limit,
      categoryId: id,
    });
    setShowCrud(true);
  };

  const confirmEditCategory = async (
    newCategoryName,
    newSpendLimit,
    categoryId
  ) => {
    let name = newCategoryName;
    let limit = newSpendLimit;
    let id = categoryId;

    const editedCategory = {
      newCategoryName: name,
      categoryId: id,
      newSpendLimit: limit,
    };

    console.log(name, id, limit);
    setLoading(true);
    await dispatch(editACategory(editedCategory))
      .then((res) => {
        console.log(res.meta);
        if (res.meta.requestStatus === "fulfilled") {
          setLoading(false);
          getExpenses();
          setCrudType({
            ...crudType,
            crudType: "",
            categoryName: "",
            categorySpendLimit: "",
            categoryId: "",
          });
          setEditCategory({
            ...editCategory,
            inputNewCategoryName: {
              ...editCategory.inputNewCategoryName,
              isTouched: false,
              isValid: false,
              value: "",
            },
            inputSpend: {
              ...editCategory.inputSpend,
              isTouched: false,
              isValid: false,
              value: "",
            },
          });

          setEditCategorySubmit(false);
        }
      })
      .catch((err) => {
        setShowModal(true);

        setModalInformation({
          ...modalInformation,
          statusName: err.name,
          message: err.message,
        });
      });
    setShowCrud(false);
  };

  const removeCategoryHandler = (categoryName, categoryId) => {
    let name = categoryName;
    let id = categoryId;

    setShowCrud(true);
    setCrudType({
      ...crudType,
      crudType: "remove-category",
      categoryName: name,
      categoryId: id,
    });
    // console.log("id", categoryId);
  };

  const confirmRemoveCategory = async (id) => {
    await dispatch(removeACategory(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        alert("Category was removed!");
      }
    });
  };

  if (fetchedExpensesList !== null) {
    categoryList = fetchedExpensesList.map((item, index) => {
      return (
        <Category
          key={index}
          categoryName={item.category}
          expensesNumber={item.expensesList.length}
          spendLimit={convertToNumber(item.spendLimit)}
          realSpend={
            calculateExpenses(item.expensesList) > 0
              ? calculateExpenses(item.expensesList)
              : 0
          }
          editAction={() =>
            editCategoryHandler(item.category, item.spendLimit, item.id)
          }
          removeAction={() => removeCategoryHandler(item.category, item.id)}
        />
      );
    });
  }

  let listContent = null;

  if (loading) {
    listContent = (
      <LoadingDiv>
        <BarLoader color="#51d289"></BarLoader>
      </LoadingDiv>
    );
  }

  let expenseForm = (
    <NewExpenseFormDiv>
      <form>
        <InputContainer
          placeholder={userExpense.inputName.placeholder}
          changed={(event) =>
            InputChangeHandler(event, userExpense.inputName.id)
          }
          invalidMessage={
            userExpense.inputName.isValid
              ? ""
              : userExpense.inputName.invalidMessage
          }
          blur={() =>
            verifyFocus(userExpense.inputName.id, userExpense.inputName.isValid)
          }
          value={userExpense.inputName.value}
          width={"200px"}
        >
          Expense Name
        </InputContainer>
        <InputContainer
          placeholder={userExpense.inputValue.placeholder}
          changed={(event) =>
            InputChangeHandler(event, userExpense.inputValue.id)
          }
          invalidMessage={
            userExpense.inputValue.isValid
              ? ""
              : userExpense.inputValue.invalidMessage
          }
          blur={() =>
            verifyFocus(
              userExpense.inputValue.id,
              userExpense.inputValue.isValid
            )
          }
          value={userExpense.inputValue.value}
          width={"200px"}
        >
          Expense Value
        </InputContainer>
        <SelectContainer
          label={"Categories"}
          options={categoryOptions}
          changed={(event) =>
            InputChangeHandler(event, userExpense.inputCategory.id)
          }
          width={"200px"}
          defaultOption
        />
        {newCategory}
        <InputContainer
          type={"date"}
          changed={(event) =>
            InputChangeHandler(event, userExpense.inputDate.id)
          }
          invalidMessage={
            userExpense.inputDate.isValid
              ? ""
              : userExpense.inputDate.invalidMessage
          }
          blur={() =>
            verifyFocus(userExpense.inputDate.id, userExpense.inputDate.isValid)
          }
          value={userExpense.inputDate.value}
          width={"200px"}
        >
          Date
        </InputContainer>
        <UserDefaultButton
          disabled={expenseSubmitPermission ? "" : "disabled"}
          onClick={(event) =>
            submitExpense(event, userExpense.inputNewCategory.value)
          }
        >
          Add Expense
        </UserDefaultButton>
      </form>
    </NewExpenseFormDiv>
  );
  if (loadingOnSubmitExpense) {
    expenseForm = (
      <LoadingDiv>
        <FadeLoader color="#51d289"></FadeLoader>
      </LoadingDiv>
    );
  }

  let categoryForm = (
    <NewCategoryFormDiv>
      <InputContainer
        placeholder={userCategory.inputNewCategory.placeholder}
        changed={(event) =>
          InputChangeHandler(event, userCategory.inputNewCategory.id)
        }
        invalidMessage={
          userCategory.inputNewCategory.isValid
            ? ""
            : userCategory.inputNewCategory.invalidMessage
        }
        blur={() =>
          verifyFocus(
            userCategory.inputNewCategory.id,
            userCategory.inputNewCategory.isValid
          )
        }
        value={userCategory.inputNewCategory.value}
        width={"200px"}
      >
        New Category Name
      </InputContainer>
      <InputContainer
        placeholder={userCategory.inputSpend.placeholder}
        changed={(event) =>
          InputChangeHandler(event, userCategory.inputSpend.id)
        }
        invalidMessage={
          userCategory.inputSpend.isValid
            ? ""
            : userCategory.inputSpend.invalidMessage
        }
        blur={() =>
          verifyFocus(
            userCategory.inputSpend.id,
            userCategory.inputSpend.isValid
          )
        }
        value={userCategory.inputSpend.value}
        width={"200px"}
      >
        Category Spending Limit
      </InputContainer>
      <UserDefaultButton
        disabled={categorySubmitPermission ? "" : "disabled"}
        onClick={() => submitCategory()}
      >
        Add Category
      </UserDefaultButton>
    </NewCategoryFormDiv>
  );
  if (loadingOnSubmitCategory) {
    categoryForm = (
      <LoadingDiv>
        <FadeLoader color="#51d289"></FadeLoader>
      </LoadingDiv>
    );
  }

  let categoriesDiv = (
    <>
      <UserItemsList>
        {fetchedExpensesList
          ? filterValue === ""
            ? fullList
            : verifySelectType()
          : listContent}
      </UserItemsList>
    </>
  );

  if (showEditCategories) {
    categoriesDiv = (
      <UserItemsList>
        <UserCategoriesListContainer>
          {fetchedExpensesList
            ? filterValue === ""
              ? categoryList
              : verifySelectType()
            : listContent}
        </UserCategoriesListContainer>
      </UserItemsList>
    );
  }

  return (
    <UserExpensesDiv>
      <UserExpensesContainer>
        <AuxDiv>
          <NewCategoryDiv>
            <NewCategoryTitleDiv>
              <DefaultTitle>New Category</DefaultTitle>
            </NewCategoryTitleDiv>
            {categoryForm}
          </NewCategoryDiv>
          <NewExpenseDiv>
            <NewExpenseTitleDiv>
              <DefaultTitle>New Expense</DefaultTitle>
            </NewExpenseTitleDiv>
            {expenseForm}
          </NewExpenseDiv>
        </AuxDiv>
        <AuxDiv>
          <ListTitleDiv>
            <DefaultTitle>
              {showEditCategories ? "Categories List" : "Expenses"}
            </DefaultTitle>
            <UserDefaultButton onClick={changeCategoryDivHandler}>
              {showEditCategories ? "Expenses List" : "Edit Category"}
            </UserDefaultButton>
          </ListTitleDiv>
          <UserExpensesListContainer>
            <ListFilterDiv>
              <InputContainer
                placeholder={
                  filterType === "Sort by name"
                    ? "Search by name"
                    : showEditCategories
                    ? "Spend Limit"
                    : "Minimum amount"
                }
                noMargin
                changed={(event) => FilterInputChangeHandler(event)}
                border={"no-right-border"}
                value={filterValue}
                width={"160px"}
              ></InputContainer>{" "}
              <SelectContainer
                options={[{ name: "sort by name" }, { name: "sort by value" }]}
                changed={(event) => FilterChangeHandler(event)}
                border={"no-left-border"}
                width={"110px"}
                noMargin
              ></SelectContainer>
            </ListFilterDiv>
            {categoriesDiv}
          </UserExpensesListContainer>
        </AuxDiv>
        <AuxDiv>
          <ExpenseHistoryDiv>
            <HistoryTitleDiv>
              <DefaultTitle>History</DefaultTitle>
            </HistoryTitleDiv>
            <HistoryContainer>{listContent}</HistoryContainer>
          </ExpenseHistoryDiv>
          <ExpenseAnalysisDiv>
            <AnalysisTitleDiv>
              <DefaultTitle>Analysis</DefaultTitle>
            </AnalysisTitleDiv>
            <AnalysisContainer>
              <PieChart categoryList={fetchedExpensesList} />
              {sliceValues.newValue === sliceValues.oldValue &&
              sliceValues.newValue !== -1 ? (
                <BarTableChart
                  expenses={
                    filteredCategories[sliceValues.newValue].expensesList
                  }
                />
              ) : (
                "Double click a slice to see more details."
              )}
            </AnalysisContainer>
          </ExpenseAnalysisDiv>
        </AuxDiv>
        {showModal ? (
          <Modal
            clicked={BackdropModalHandler}
            status={modalInformation.statusName}
            message={modalInformation.message}
          />
        ) : null}

        {showCrud ? (
          <Crud
            crudType={crudType.crudType}
            categoryName={crudType.categoryName}
            categorySpendLimit={crudType.categorySpendLimit}
            clicked={BackdropCrudHandler}
            cancelAction={BackdropCrudHandler}
            categoryNameInputConfig={editCategory.inputNewCategoryName}
            categorySpendInputConfig={editCategory.inputSpend}
            categoryNameChanged={(event) =>
              InputChangeHandler(
                event,
                editCategory.inputNewCategoryName.id,
                crudType.categoryId
              )
            }
            categorySpendChanged={(event) =>
              InputChangeHandler(event, editCategory.inputSpend.id)
            }
            categoryNameBlur={() =>
              verifyFocus(
                editCategory.inputNewCategoryName.id,
                editCategory.inputNewCategoryName.isValid,
                crudType.categoryId
              )
            }
            categorySpendBlur={() =>
              verifyFocus(
                editCategory.inputSpend.id,
                editCategory.inputSpend.isValid
              )
            }
            editCategory={() =>
              confirmEditCategory(
                editCategory.inputNewCategoryName.value,
                editCategory.inputSpend.value,
                crudType.categoryId
              )
            }
            removeCategory={() => {
              confirmRemoveCategory(crudType.categoryId);
            }}
            continueDisabled={editCategorySubmit ? "" : "disabled"}
          />
        ) : null}
      </UserExpensesContainer>
    </UserExpensesDiv>
  );
};

export default UserExpenses;
