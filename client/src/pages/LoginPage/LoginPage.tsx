import femalePicture from "../../assets/genderIcons/female.png"
import malePicture from "../../assets/genderIcons/male.png"
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {choicedGender, selectFemaleGender, selectMaleGender} from "../../features/choiceGenderSlice.ts";
import {getProgress, resetUser, saveUser, selectAddUserName, selectUserData} from "../../features/usersDataSlice.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginPage () {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const male = useAppSelector(selectMaleGender);
    const female = useAppSelector(selectFemaleGender);
    const player = useAppSelector(selectUserData);
    const [inputUserName, setInputUserName] = useState("")

    useEffect(() => {
        if (player.id) {
            dispatch(getProgress(player.id));
        }
    }, [player.id, dispatch]);

    const choiceGenderHandler = (stateGender: boolean) => {
        dispatch(choicedGender(stateGender))
    }

    const addUserNameHandler = async() => {
        if(inputUserName.trim()) {
            try {
                const result = await dispatch(saveUser({name: inputUserName, score: 0})).unwrap()
                if(result?.player?.id) {
                    await dispatch(getProgress(result.player.id))
                }
                navigate("/game");
            } catch (error) {
                console.error("Ошибка при сохранении пользователя:", error);
            }
        }
    }

    return (
        <>
            <div className={"main_container"}>
                  <div className={"main_container__startsCard"}>
                         <div className={"main_container__startsCard__name"}>СВОЯ ИГРА</div>
                          <div className={male ?
                              "main_container__startsCard__pictureMale":
                              "main_container__startsCard__pictureFemale"}></div>
                       <div className={"main_container__startsCard__gender"}>
                           <img onClick={ () =>  choiceGenderHandler(true)}
                                className={male ?
                                    "main_container__startsCard__gender__maleActiv":
                                     "main_container__startsCard__gender__male"}
                                src={malePicture} alt=""/>
                           <img onClick={() =>  choiceGenderHandler(false)}
                                className={female ?
                                    "main_container__startsCard__gender__femaleActiv":
                                    "main_container__startsCard__gender__female"}
                                src={femalePicture} alt=""/>
                       </div>
                     <input onChange={(event) => setInputUserName(event.target.value)}
                            className={"main_container__startsCard__placeName"}
                            type="text" placeholder={"Ваше имя..."}/>
                      <button
                          onClick={addUserNameHandler}
                          className={"main_container__startsCard__entranceButton"}>ВХОД</button>
                  </div>
             </div>
        </>
)
}

export default LoginPage